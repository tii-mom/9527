import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { prisma } from "../db/prisma.js";
import { requireUser } from "../services/auth.js";
import { fail, ok } from "../utils/http.js";

export async function shopRoutes(app: FastifyInstance) {
  app.get("/v1/shop/items", async () => {
    const items = await prisma.shopItem.findMany({ where: { status: "active" }, orderBy: { pointsPrice: "asc" } });
    return ok({ items });
  });

  app.post("/v1/shop/redeem", async (req: any, reply) => {
    const user = await requireUser(req);
    if (!user) return fail(reply, 401, "UNAUTHORIZED", "Missing or invalid token");
    const item = await prisma.shopItem.findFirst({ where: { id: req.body?.itemId, status: "active" } });
    if (!item) return fail(reply, 404, "NOT_FOUND", "Shop item not found");
    const account = await prisma.pointAccount.upsert({ where: { userId: user.id }, create: { userId: user.id }, update: {} });
    if (account.availablePoints < item.pointsPrice) return fail(reply, 400, "INSUFFICIENT_POINTS", "Insufficient points");

    const order = await prisma.$transaction(async (tx) => {
      await tx.pointAccount.update({
        where: { userId: user.id },
        data: { availablePoints: { decrement: item.pointsPrice }, redeemedPoints: { increment: item.pointsPrice } },
      });
      await tx.pointLedger.create({
        data: {
          id: `pl_${randomUUID()}`,
          userId: user.id,
          sourceType: "redemption",
          sourceId: item.id,
          eventType: "redeem",
          points: -item.pointsPrice,
          status: "completed",
          description: item.name,
          availableAt: new Date(),
        },
      });
      return tx.redemptionOrder.create({
        data: {
          id: `red_${randomUUID()}`,
          userId: user.id,
          itemId: item.id,
          pointsCost: item.pointsPrice,
          status: item.requiresReview ? "pending_review" : "approved",
          deliveryType: item.deliveryType,
          deliveryPayload: req.body?.deliveryInfo || {},
        },
      });
    });

    return ok({ orderId: order.id, status: order.status });
  });

  app.get("/v1/redemptions", async (req, reply) => {
    const user = await requireUser(req);
    if (!user) return fail(reply, 401, "UNAUTHORIZED", "Missing or invalid token");
    return ok({ items: await prisma.redemptionOrder.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }) });
  });

  app.get("/v1/redemptions/:id", async (req: any, reply) => {
    const user = await requireUser(req);
    if (!user) return fail(reply, 401, "UNAUTHORIZED", "Missing or invalid token");
    return ok({ order: await prisma.redemptionOrder.findFirst({ where: { id: req.params.id, userId: user.id } }) });
  });
}
