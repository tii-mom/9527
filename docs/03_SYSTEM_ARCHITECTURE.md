# 03. 系统架构

## 总体架构

```txt
用户终端
  |
  | 9527 CLI
  v
CLI Client
  - command wrapper
  - stdout/stderr watcher
  - idle detector
  - sponsor card renderer
  - local config
  - API client
  |
  | HTTPS
  v
API Server
  - auth/init
  - device registration
  - campaign selector
  - ad session
  - event tracking
  - reward engine
  - point ledger
  - shop
  - redemption
  - fraud/rate limit
  |
  v
PostgreSQL + Redis
  |
  v
Web/Admin
  - website
  - ad landing page
  - rewards page
  - admin panel
```

## Monorepo 推荐结构

```txt
9527/
  apps/
    api/
    web/
  packages/
    cli/
    shared/
  prisma/
  docs/
  package.json
  pnpm-workspace.yaml
```

## apps/api

职责：

- 提供 REST API。
- 写入积分账本。
- 管理广告 session。
- 管理商城兑换。
- 管理风控限频。

推荐：Node.js + TypeScript + Fastify/Express + Prisma + PostgreSQL + Redis。

## apps/web

职责：官网、广告落地页、商城展示页、用户协议、隐私政策、Admin 后台。推荐 Next.js。

## packages/cli

职责：npm CLI 包、命令包装、idle 检测、终端广告展示、API 通信。

## packages/shared

职责：共享类型、共享常量、API response types、campaign/shop/ledger 类型。

## 数据流：广告展示

```txt
CLI 检测 idle
  -> 请求 /v1/campaigns/next
  -> 创建 /v1/ad-sessions
  -> 终端展示 sponsor card
  -> 上报 shown
  -> 用户按 v
  -> 打开 /a/:sessionId 或显示链接
  -> 上报 viewed/clicked/completed
  -> reward engine 发放积分
```

## 数据流：商城兑换

```txt
用户 9527 shop
  -> GET /v1/shop/items
  -> 用户选择商品
  -> POST /v1/shop/redeem
  -> 检查积分余额
  -> 扣积分
  -> 创建 redemption_order
  -> 自动发放或进入人工审核
```

## 环境变量

```env
DATABASE_URL=
REDIS_URL=
JWT_SECRET=
API_BASE_URL=
WEB_BASE_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
NODE_ENV=
```
