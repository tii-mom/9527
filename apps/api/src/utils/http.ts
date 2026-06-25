import type { FastifyReply } from "fastify";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "ALREADY_REWARDED"
  | "EXPIRED"
  | "TOO_EARLY"
  | "CAMPAIGN_INACTIVE"
  | "RATE_LIMITED"
  | "INSUFFICIENT_POINTS";

export function ok<T>(data: T) {
  return { ok: true as const, data };
}

export function fail(reply: FastifyReply, status: number, code: ApiErrorCode, message: string) {
  return reply.code(status).send({ ok: false as const, error: { code, message } });
}
