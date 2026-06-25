# 9527

9527 是一个面向 AI coding / vibe coding 场景的命令行广告积分奖励系统。

用户通过 npm 安装 CLI，在运行 AI 编码、构建、测试、部署等命令时，系统检测等待空窗，在终端中展示非侵入式 sponsor 广告卡片。用户主动查看广告后获得平台积分。积分可进入积分商城，用于兑换模型 token、AI 工具额度、云服务 credit、开发者工具优惠券，后续可在合规条件下兑换 USDC、USDT 或平台代币。

## V1 核心闭环

```txt
CLI wrapper
→ idle detector
→ terminal sponsor card
→ 用户主动查看
→ 服务端广告 session
→ 服务端积分账本
→ balance/shop/redeem
→ admin 手动运营
```

## 推荐技术栈

```txt
Monorepo: pnpm workspace
CLI: Node.js + TypeScript + Commander
API: Fastify 或 Express + TypeScript
DB: PostgreSQL + Prisma
Cache: Redis / Upstash
Web: Next.js
Deployment: Vercel + Railway/Render/Fly.io + Neon/Supabase + Upstash
```

## 文档

请阅读 `docs/` 目录，尤其是：

- `docs/00_PROJECT_OVERVIEW.md`
- `docs/01_PRODUCT_SPEC.md`
- `docs/02_MVP_SCOPE.md`
- `docs/03_SYSTEM_ARCHITECTURE.md`
- `docs/04_CLI_SPEC.md`
- `docs/05_API_SPEC.md`
- `docs/06_DATABASE_SCHEMA.md`
- `docs/07_POINTS_AND_SHOP.md`
- `docs/08_AD_SYSTEM.md`
- `docs/09_WEB_ADMIN_DEPLOYMENT.md`
- `docs/10_BUSINESS_MODEL.md`
- `docs/11_COMPLIANCE_AND_RISK.md`
- `docs/12_ROADMAP.md`
- `docs/13_DEV_TASKS.md`
- `docs/14_OPEN_QUESTIONS.md`
- `docs/15_CODEX_PROMPT.md`

## 项目名

```txt
项目名：9527
CLI 命令：9527
npm 包名：暂定 9527 或 @9527/cli
积分名：9527 Points / Dev Points，最终可后置决定
```

## MVP local development

```bash
pnpm install
cp .env.example .env
pnpm db:push
pnpm db:seed
pnpm dev
```

API runs on `http://localhost:3000`; Web/Admin runs on `http://localhost:3001`.

### CLI local test

```bash
pnpm --filter @9527/cli build
node packages/cli/dist/index.js init
node packages/cli/dist/index.js run -- sleep 10
node packages/cli/dist/index.js balance
node packages/cli/dist/index.js shop
node packages/cli/dist/index.js redeem item_model_100k --email dev@example.com
```

The CLI stores config at `~/.9527/config.json`, disables sponsor cards in CI, and never runs ad logic during package install.

### Manual MVP smoke test

After `pnpm install`, `pnpm db:push`, `pnpm db:seed`, `pnpm build`, and `pnpm dev`, run:

```bash
node scripts/manual-smoke.mjs
node packages/cli/dist/index.js run -- sleep 10
# Press v, open the printed /a/:sessionId?ct=... landing URL, wait 20s, complete.
node packages/cli/dist/index.js balance
node packages/cli/dist/index.js shop
node packages/cli/dist/index.js redeem item_model_100k --email dev@example.com
```
