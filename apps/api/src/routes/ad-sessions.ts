import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyRequest } from "fastify";
import type { AdSession } from "@prisma/client";
import { prisma } from "../db/prisma.js";
import { generateClaimToken, requireUser, requestIp } from "../services/auth.js";
import { completeAdSession, hashIp } from "../services/reward-engine.js";
import { fail, ok } from "../utils/http.js";

function claimToken(req: FastifyRequest) {
  return req.headers["x-9527-claim-token"]?.toString();
}

async function authorizeSession(
  req: FastifyRequest,
  sessionId: string,
): Promise<{ session?: AdSession; error?: { status: number; code: "NOT_FOUND" | "FORBIDDEN"; message: string } }> {
  const session = await prisma.adSession.findUnique({ where: { id: sessionId } });
  if (!session) return { error: { status: 404, code: "NOT_FOUND" as const, message: "Session not found" } };
  const user = await requireUser(req);
  const claim = claimToken(req);
  if (user && session.userId === user.id) return { session };
  if (claim && session.claimToken === claim) return { session };
  return { error: { status: 403, code: "FORBIDDEN" as const, message: "Forbidden" } };
}

export async function adSessionRoutes(app: FastifyInstance) {
  app.post("/v1/ad-sessions", async (req: any, reply) => {
    const user = await requireUser(req);
    if (!user) return fail(reply, 401, "UNAUTHORIZED", "Missing or invalid token");

    const body = req.body || {};
    const device = await prisma.device.findFirst({ where: { id: body.deviceId, userId: user.id } });
    if (!device) return fail(reply, 404, "NOT_FOUND", "Device not found");

    const campaign = await prisma.campaign.findFirst({ where: { id: body.campaignId, status: "active" } });
    if (!campaign) return fail(reply, 404, "NOT_FOUND", "Campaign not found");

    const id = `ads_${randomUUID()}`;
    const token = generateClaimToken();
    const session = await prisma.adSession.create({
      data: {
        id,
        claimToken: token,
        userId: user.id,
        deviceId: device.id,
        campaignId: campaign.id,
        rewardPoints: campaign.rewardPoints,
        context: body.context,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        ipHash: hashIp(requestIp(req)),
        userAgent: Array.isArray(req.headers["user-agent"]) ? req.headers["user-agent"][0] : req.headers["user-agent"],
      },
    });
    const landingUrl = `${process.env.WEB_BASE_URL || "http://localhost:3001"}/a/${session.id}?ct=${encodeURIComponent(token)}`;
    return ok({ sessionId: session.id, landingUrl, claimToken: token, expiresAt: session.expiresAt });
  });

  for (const event of ["shown", "viewed", "clicked"] as const) {
    app.post(`/v1/ad-sessions/:id/${event}`, async (req: any, reply) => {
      const authorized = await authorizeSession(req, req.params.id);
      if (authorized.error) return fail(reply, authorized.error.status, authorized.error.code, authorized.error.message);
      const field = `${event}At`;
      const session = await prisma.adSession.update({
        where: { id: req.params.id },
        data: { [field]: new Date(), status: event },
      });
      return ok({ sessionId: session.id, status: session.status });
    });
  }

  app.post("/v1/ad-sessions/:id/completed", async (req: any, reply) => {
    const user = await requireUser(req);
    const result = await completeAdSession({ sessionId: req.params.id, userId: user?.id, claimToken: claimToken(req) });
    if (!result.ok) return fail(reply, result.status, result.code as any, result.message);
    return ok(result.data);
  });

  app.get("/v1/ad-sessions/:id", async (req: any) => {
    const session = await prisma.adSession.findUnique({
      where: { id: req.params.id },
      include: { campaign: true },
    });
    if (!session) return ok({ session: null });
    return ok({
      session: {
        id: session.id,
        rewardPoints: session.rewardPoints,
        expiresAt: session.expiresAt,
        campaign: {
          sponsorName: session.campaign.sponsorName,
          headline: session.campaign.headline,
          body: session.campaign.body,
          targetUrl: session.campaign.targetUrl,
          rewardPoints: session.campaign.rewardPoints,
        },
      },
    });
  });
}
