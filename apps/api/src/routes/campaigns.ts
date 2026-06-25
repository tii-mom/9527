import type { FastifyInstance } from "fastify";
import { prisma } from "../db/prisma.js";
import { ok } from "../utils/http.js";

export async function campaignRoutes(app: FastifyInstance) {
  app.post("/v1/campaigns/next", async () => {
    const campaign = await prisma.campaign.findFirst({
      where: { status: "active" },
      select: { id: true, sponsorName: true, headline: true, body: true, rewardPoints: true, status: true },
    });
    return ok({ campaign });
  });
}
