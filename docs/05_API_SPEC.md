# 05. API 规格

## 通用规则

Base URL: `https://api.9527.dev`

认证：`Authorization: Bearer <apiToken>`

成功响应：

```json
{ "ok": true, "data": {} }
```

错误响应：

```json
{ "ok": false, "error": { "code": "RATE_LIMITED", "message": "Too many reward attempts" } }
```

## POST /v1/init

请求：

```json
{
  "email": "user@example.com",
  "githubId": null,
  "deviceHash": "hash_xxx",
  "os": "darwin",
  "cliVersion": "0.1.0"
}
```

响应：

```json
{
  "ok": true,
  "data": {
    "userId": "user_xxx",
    "deviceId": "device_xxx",
    "apiToken": "token_xxx"
  }
}
```

## POST /v1/campaigns/next

请求：

```json
{
  "deviceId": "device_xxx",
  "context": {
    "command": "npm test",
    "packageManager": "npm",
    "language": "typescript",
    "os": "darwin"
  }
}
```

响应：

```json
{
  "ok": true,
  "data": {
    "campaign": {
      "id": "camp_xxx",
      "sponsorName": "Neon",
      "headline": "Serverless Postgres for AI apps",
      "body": "Claim free dev credits.",
      "rewardPoints": 8
    }
  }
}
```

无广告：

```json
{ "ok": true, "data": { "campaign": null } }
```

## Ad Sessions

### POST /v1/ad-sessions

请求：

```json
{
  "campaignId": "camp_xxx",
  "deviceId": "device_xxx",
  "context": { "command": "npm test" }
}
```

响应：

```json
{
  "ok": true,
  "data": {
    "sessionId": "ads_xxx",
    "landingUrl": "https://9527.dev/a/ads_xxx",
    "expiresAt": "2026-06-25T00:30:00.000Z"
  }
}
```

### POST /v1/ad-sessions/:id/shown

记录终端展示。

### POST /v1/ad-sessions/:id/viewed

记录用户按 v。

### POST /v1/ad-sessions/:id/clicked

记录点击广告主链接。

### POST /v1/ad-sessions/:id/completed

完成广告并尝试发放积分。

响应：

```json
{
  "ok": true,
  "data": {
    "rewarded": true,
    "points": 8,
    "balance": {
      "availablePoints": 1280,
      "pendingPoints": 300
    }
  }
}
```

## Points

### GET /v1/points/balance

返回 available/pending/locked/redeemed/expired。

### GET /v1/points/ledger

返回积分流水。

## Shop

### GET /v1/shop/items

返回商品列表。

### POST /v1/shop/redeem

请求：

```json
{
  "itemId": "item_model_100k",
  "deliveryInfo": {
    "email": "user@example.com"
  }
}
```

响应：

```json
{
  "ok": true,
  "data": {
    "orderId": "red_xxx",
    "status": "pending"
  }
}
```

## Admin API

```txt
POST /admin/campaigns
GET /admin/campaigns
PATCH /admin/campaigns/:id
POST /admin/shop/items
GET /admin/shop/items
PATCH /admin/shop/items/:id
GET /admin/redemptions
PATCH /admin/redemptions/:id
GET /admin/users
GET /admin/users/:id
GET /admin/analytics
```
