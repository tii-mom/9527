import { createHash, randomUUID } from "node:crypto";
import { MIN_VIEW_SECONDS } from "@9527/shared";
import { prisma } from "../db/prisma.js";

export type RewardResult =
  | { ok: true; data: { rewarded: true; points: number; balance: unknown } }
  | { ok: false; status: number; code: string; message: string };

function startOfDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function hashIp(ip: string) {
  return createHash("sha256").update(ip).digest("hex");
}

export async function completeAdSession(input: { sessionId: string; userId?: string; claimToken?: string }): Promise<RewardResult> {
  const session = await prisma.adSession.findUnique({ where: { id: input.sessionId }, include: { campaign: true } });
  if (!session) return { ok: false, status: 404, code: "NOT_FOUND", message: "Session not found" };
  if (input.userId && session.userId !== input.userId) return { ok: false, status: 403, code: "FORBIDDEN", message: "Forbidden" };
  if (input.claimToken && session.claimToken !== input.claimToken) return { ok: false, status: 403, code: "FORBIDDEN", message: "Invalid claim token" };
  if (!input.userId && !input.claimToken) return { ok: false, status: 401, code: "UNAUTHORIZED", message: "Missing credentials" };
  if (session.rewardedAt) return { ok: false, status: 409, code: "ALREADY_REWARDED", message: "Session already rewarded" };
  if (session.expiresAt < new Date()) return { ok: false, status: 400, code: "EXPIRED", message: "Session expired" };
  if (!session.viewedAt || Date.now() - session.viewedAt.getTime() < MIN_VIEW_SECONDS * 1000) {
    return { ok: false, status: 400, code: "TOO_EARLY", message: "Stay for at least 20 seconds" };
  }
  if (session.campaign.status !== "active") return { ok: false, status: 400, code: "CAMPAIGN_INACTIVE", message: "Campaign inactive" };

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const today = startOfDay();
  const [userHourly, userDaily, deviceHourly, ipHourly, campaignDaily] = await Promise.all([
    prisma.adSession.count({ where: { userId: session.userId, rewardedAt: { gte: hourAgo } } }),
    prisma.adSession.count({ where: { userId: session.userId, rewardedAt: { gte: today } } }),
    prisma.adSession.count({ where: { deviceId: session.deviceId, rewardedAt: { gte: hourAgo } } }),
    session.ipHash ? prisma.adSession.count({ where: { ipHash: session.ipHash, rewardedAt: { gte: hourAgo } } }) : Promise.resolve(0),
    prisma.adSession.count({ where: { userId: session.userId, campaignId: session.campaignId, rewardedAt: { gte: today } } }),
  ]);

  if (userHourly >= 5) return { ok: false, status: 429, code: "RATE_LIMITED", message: "User hourly reward limit reached" };
  if (userDaily >= 30) return { ok: false, status: 429, code: "RATE_LIMITED", message: "User daily reward limit reached" };
  if (deviceHourly >= 5) return { ok: false, status: 429, code: "RATE_LIMITED", message: "Device hourly reward limit reached" };
  if (ipHourly >= 20) return { ok: false, status: 429, code: "RATE_LIMITED", message: "IP hourly reward limit reached" };
  if (campaignDaily >= 1) return { ok: false, status: 429, code: "RATE_LIMITED", message: "Campaign daily reward limit reached" };

  const balance = await prisma.$transaction(async (tx) => {
    const fresh = await tx.adSession.findUniqueOrThrow({ where: { id: session.id } });
    if (fresh.rewardedAt) throw new Error("Session already rewarded");
    await tx.pointLedger.create({
      data: {
        id: `pl_${randomUUID()}`,
        userId: session.userId,
        sourceType: "ad_session",
        sourceId: session.id,
        eventType: "ad_completed",
        points: session.rewardPoints,
        status: "available",
        description: `Sponsor ${session.campaign.sponsorName}`,
        availableAt: new Date(),
      },
    });
    const account = await tx.pointAccount.upsert({
      where: { userId: session.userId },
      create: { userId: session.userId, availablePoints: session.rewardPoints },
      update: { availablePoints: { increment: session.rewardPoints } },
    });
    await tx.adSession.update({
      where: { id: session.id },
      data: { completedAt: new Date(), rewardedAt: new Date(), status: "rewarded" },
    });
    return account;
  });

  return { ok: true, data: { rewarded: true, points: session.rewardPoints, balance } };
}
