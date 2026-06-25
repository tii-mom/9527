# 15. Codex 云端完整开发任务提示词

你现在负责开发项目 `9527`。

9527 是一个通过 npm 安装的命令行广告积分奖励系统，面向 AI coding / vibe coding 用户。用户运行 `9527 run -- <command>` 包装原命令。当子命令仍在运行且 stdout/stderr 超过 5 秒无输出时，CLI 展示一条非侵入式 sponsor card。用户按 `v` 主动查看广告后，服务端创建/更新广告 session，并在满足最短停留、限频、防重复奖励等条件后给用户发放平台积分。积分可在商城兑换模型 token、开发者工具 credit、云服务 credit，USDC/USDT 暂时作为 waitlist 或后置功能。

## 仓库

GitHub 仓库：`tii-mom/9527`

请先阅读仓库中的全部文档：

```txt
README.md
docs/00_PROJECT_OVERVIEW.md
docs/01_PRODUCT_SPEC.md
docs/02_MVP_SCOPE.md
docs/03_SYSTEM_ARCHITECTURE.md
docs/04_CLI_SPEC.md
docs/05_API_SPEC.md
docs/06_DATABASE_SCHEMA.md
docs/07_POINTS_AND_SHOP.md
docs/08_AD_SYSTEM.md
docs/09_WEB_ADMIN_DEPLOYMENT.md
docs/10_BUSINESS_MODEL.md
docs/11_COMPLIANCE_AND_RISK.md
docs/12_ROADMAP.md
docs/13_DEV_TASKS.md
docs/14_OPEN_QUESTIONS.md
```

## 你的目标

开发整个项目的 MVP 版本，完成最小可跑闭环：

```txt
9527 init
9527 run -- sleep 10
idle 后出现 sponsor card
按 v 显示广告链接 / landing page
调用 API 创建 session
广告落地页 20 秒后完成
服务端发放积分
9527 balance 能看到积分
9527 shop 能看到商品
9527 redeem 能创建兑换订单
Admin 可创建 campaign/shop item 并审核 redemption
```

## 技术栈要求

```txt
Monorepo: pnpm workspace
CLI: Node.js + TypeScript + Commander + tsup
API: Node.js + TypeScript + Fastify 或 Express
DB: PostgreSQL + Prisma
Cache: Redis；开发环境没有 Redis 时可 fallback memory store
Web: Next.js
Admin: 可以并入 Next.js /admin
```

## 推荐项目结构

```txt
9527/
  apps/
    api/
      src/
        server.ts
        routes/
        services/
        db/
      package.json
    web/
      app/
        page.tsx
        a/[sessionId]/page.tsx
        rewards/page.tsx
        privacy/page.tsx
        terms/page.tsx
        admin/
      package.json
  packages/
    cli/
      src/
        index.ts
        commands/
          init.ts
          run.ts
          balance.ts
          shop.ts
          redeem.ts
          config.ts
        core/
          command-wrapper.ts
          idle-detector.ts
          sponsor-card.ts
          local-config.ts
          api-client.ts
      package.json
    shared/
      src/
        types.ts
        constants.ts
      package.json
  prisma/
    schema.prisma
    seed.ts
  docs/
  package.json
  pnpm-workspace.yaml
  .env.example
```

## 第一阶段必须完成：CLI

实现命令：

```txt
9527 init
9527 run -- <command>
9527 balance
9527 shop
9527 redeem <itemId>
9527 config get
9527 config set <key> <value>
9527 enable
9527 disable
9527 version
```

本地配置路径：

```txt
~/.9527/config.json
```

配置字段：

```json
{
  "userId": "user_xxx",
  "deviceId": "device_xxx",
  "apiToken": "token_xxx",
  "adsEnabled": true,
  "apiBaseUrl": "http://localhost:3000",
  "webBaseUrl": "http://localhost:3001",
  "cliVersion": "0.1.0"
}
```

CLI 行为要求：

1. `9527 init` 调用 API `/v1/init`，写入本地配置。
2. `9527 run -- <command>` 必须原样执行用户命令。
3. stdout/stderr 必须原样输出。
4. stdin 继承。
5. 原命令退出码必须保持。
6. API 错误不得影响原命令。
7. 广告展示错误不得影响原命令。
8. `CI=true` 或 GitHub Actions 等 CI 环境默认不展示广告。
9. 用户可通过 `9527 disable` 关闭广告。
10. 不要在 postinstall 阶段运行任何广告逻辑。

Idle 规则：

```txt
adsEnabled = true
not CI
child still running
stdout/stderr no output > 5 seconds
last sponsor card > 10 minutes ago
not sensitive command
server returns eligible campaign
```

敏感命令黑名单：

```txt
ssh
scp
sftp
vim
nano
emacs
git commit
git rebase
sudo
passwd
mysql
psql
mongo
redis-cli
```

Sponsor card：

```txt
╭────────────────────────────────────────────╮
│ Sponsor · Neon                             │
│ Serverless Postgres for AI apps.           │
│ [v] View +8 pts   [s] Skip   [x] Off       │
╰────────────────────────────────────────────╯
```

按键行为：

```txt
v: 创建/查看 session，显示 landing URL，不自动强制打开浏览器
s: 跳过，不发奖励
x: 关闭广告，写入本地 config
```

## 第二阶段必须完成：API

实现：

```txt
POST /v1/init
GET  /v1/me
POST /v1/campaigns/next
POST /v1/ad-sessions
POST /v1/ad-sessions/:id/shown
POST /v1/ad-sessions/:id/viewed
POST /v1/ad-sessions/:id/clicked
POST /v1/ad-sessions/:id/completed
GET  /v1/ad-sessions/:id
GET  /v1/points/balance
GET  /v1/points/ledger
GET  /v1/shop/items
POST /v1/shop/redeem
GET  /v1/redemptions
GET  /v1/redemptions/:id
```

开发阶段 seed 一条 campaign：

```txt
Sponsor: Neon
Headline: Serverless Postgres for AI apps
Body: Claim free dev credits.
Target URL: https://neon.tech
Reward: 8 points
```

再 seed 至少三个 shop items：

```txt
100K model tokens：1000 points
AI coding credit：2000 points
USDC payout waitlist：10000 points，需要人工审核
```

## 第三阶段必须完成：Reward Engine

完成广告时必须检查：

```txt
session 存在
session 属于当前用户
session 未奖励过
session 未过期
viewed_at 至少 20 秒前
用户未超过限频
设备未超过限频
IP 未超过限频
campaign 有效
```

成功后：

```txt
写 point_ledger
更新 point_accounts
标记 session rewarded
返回新余额
```

同一 session 绝对不能重复奖励。

## 第四阶段必须完成：数据库

使用 Prisma 建模：

```txt
User
Device
Campaign
AdSession
PointAccount
PointLedger
ShopItem
RedemptionOrder
CryptoPayout
```

字段以 `docs/06_DATABASE_SCHEMA.md` 为准，可按 Prisma 类型合理调整。

需要提供：

```txt
prisma/schema.prisma
prisma/seed.ts
pnpm db:push
pnpm db:seed
```

## 第五阶段必须完成：Web

实现 Next.js Web：

```txt
/
  首页，介绍 9527 和安装方式

/a/[sessionId]
  广告落地页：显示 sponsor、20 秒倒计时、点击 sponsor 链接、完成后调用 complete API

/rewards
  展示商城商品

/privacy
  隐私政策占位文本

/terms
  用户协议占位文本

/admin
  内部后台
```

广告落地页要求：

1. 根据 sessionId 拉取 session/campaign。
2. 显示 sponsor 信息。
3. 20 秒倒计时。
4. 用户点击完成后调用 `/v1/ad-sessions/:id/completed`。
5. 显示奖励成功或失败原因。

## 第六阶段必须完成：Admin

Admin 可以做得简单，但必须可用。

功能：

```txt
固定 admin token 或 basic auth 登录
Campaign 列表
创建 Campaign
编辑/暂停 Campaign
Shop Item 列表
创建 Shop Item
Redemption Order 列表
审核通过/拒绝订单
User/Point Ledger 查询
```

V1 不需要广告主自助后台。

## 第七阶段必须完成：安全与隐私

必须遵守：

1. 不上传源码。
2. 不读取 `.env`。
3. 不上传文件内容。
4. 不在 postinstall 阶段展示广告。
5. 不默认直接发币。
6. 不承诺积分等于固定美元价值。
7. USDT/USDC 兑换先作为 waitlist 或人工审核功能。
8. 广告必须明确标注 Sponsor。
9. 用户必须可以关闭广告。
10. CI 环境默认不展示广告。

## 第八阶段必须完成：开发体验

根目录提供脚本：

```json
{
  "scripts": {
    "dev": "pnpm -r dev",
    "build": "pnpm -r build",
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck",
    "db:push": "pnpm --filter api db:push",
    "db:seed": "pnpm --filter api db:seed"
  }
}
```

提供 `.env.example`。

提供 README 中的本地启动说明：

```bash
pnpm install
cp .env.example .env
pnpm db:push
pnpm db:seed
pnpm dev
```

CLI 本地测试说明：

```bash
pnpm --filter @9527/cli build
node packages/cli/dist/index.js init
node packages/cli/dist/index.js run -- sleep 10
node packages/cli/dist/index.js balance
node packages/cli/dist/index.js shop
```

## 验收标准

必须满足：

```txt
pnpm install 成功
pnpm build 成功
本地 API 可启动
本地 Web 可启动
CLI 可 build
9527 init 成功
9527 run -- sleep 10 可触发 sponsor card
按 v 可创建 session 并显示 landing URL
/a/:sessionId 可完成广告
9527 balance 可显示积分
9527 shop 可显示商品
9527 redeem 可创建兑换订单
同一 session 不能重复奖励
未满 20 秒不能奖励
CI=true 时不展示广告
失败命令退出码保持不变
```

## 输出要求

请在一个新分支完成开发，例如：

```txt
codex/9527-mvp
```

提交 PR 到 `main`。PR 描述必须包含：

```txt
1. 实现内容总结
2. 本地启动步骤
3. 测试命令和结果
4. 已知限制
5. 下一步建议
```

不要只提交文档；必须提交可运行的 MVP 代码。
