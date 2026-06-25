import type { FastifyInstance } from "fastify";
import { prisma } from "../db/prisma.js";
import { requireUser } from "../services/auth.js";
import { fail, ok } from "../utils/http.js";

export async function pointRoutes(app: FastifyInstance) {
  app.get("/v1/points/balance", async (req, reply) => {
    const user = await requireUser(req);
    if (!user) return fail(reply, 401, "UNAUTHORIZED", "Missing or invalid token");
    const balance = await prisma.pointAccount.upsert({ where: { userId: user.id }, create: { userId: user.id }, update: {} });
    return ok(balance);
  });

  app.get("/v1/points/ledger", async (req, reply) => {
    const user = await requireUser(req);
    if (!user) return fail(reply, 401, "UNAUTHORIZED", "Missing or invalid token");
    const items = await prisma.pointLedger.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
    return ok({ items });
  });
}
