export type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: { code: string; message: string } };
export type LocalConfig = { userId?: string; deviceId?: string; apiToken?: string; adsEnabled: boolean; apiBaseUrl: string; webBaseUrl: string; cliVersion: string; createdAt?: string };
export type Campaign = { id: string; sponsorName: string; headline: string; body: string; targetUrl?: string; rewardPoints: number; status?: string };
export type Balance = { pendingPoints: number; availablePoints: number; lockedPoints: number; redeemedPoints: number; expiredPoints: number };
export type ShopItem = { id: string; category: string; name: string; description?: string | null; pointsPrice: number; deliveryType: string; requiresReview: boolean; status: string };
export type RedemptionOrder = { id: string; itemId: string; pointsCost: number; status: string; deliveryType: string; createdAt: string };
