import { randomBytes, randomUUID } from "node:crypto";
import type { FastifyRequest } from "fastify";
import { prisma } from "../db/prisma.js";

export function generateApiToken() {
  return `tok_${randomBytes(32).toString("base64url")}`;
}

export function generateClaimToken() {
  return `claim_${randomBytes(32).toString("base64url")}`;
}

export async function createUserAndDevice(input: { deviceHash?: string; os?: string; cliVersion?: string }) {
  const userId = `user_${randomUUID()}`;
  const deviceId = `dev_${randomUUID()}`;
  const apiToken = generateApiToken();

  await prisma.user.create({ data: { id: userId, apiToken, account: { create: {} } } });
  await prisma.device.create({
    data: {
      id: deviceId,
      userId,
      deviceHash: input.deviceHash || deviceId,
      os: input.os,
      cliVersion: input.cliVersion,
    },
  });

  return { userId, deviceId, apiToken };
}

export async function requireUser(req: FastifyRequest) {
  const header = req.headers.authorization || "";
  const token = Array.isArray(header) ? header[0]?.replace(/^Bearer\s+/i, "") : header.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  return prisma.user.findUnique({ where: { apiToken: token } });
}

export function requestIp(req: FastifyRequest) {
  return req.ip || req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() || "unknown";
}
