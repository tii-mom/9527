# 13. 开发任务拆解

## Epic 1：Monorepo 初始化

任务：

```txt
创建 pnpm workspace
创建 apps/api
创建 apps/web
创建 packages/cli
创建 packages/shared
配置 TypeScript
配置 ESLint/Prettier
配置环境变量模板
```

验收：`pnpm install`、`pnpm build`、`pnpm dev` 可运行。

## Epic 2：CLI Skeleton

任务：

```txt
Commander 命令
init
run
balance
shop
config
enable/disable
本地 config 读写
```

验收：`9527 --help` 正常，`9527 init` 生成 `~/.9527/config.json`。

## Epic 3：Command Wrapper

任务：

```txt
解析 run -- 后面的命令
spawn 子进程
stdout/stderr 原样输出
stdin 继承
退出码保持
异常处理
```

验收：`9527 run -- echo hello`、`9527 run -- npm test`、失败命令退出码保持不变。

## Epic 4：Idle Detector + Sponsor Card

任务：

```txt
监听输出时间
5 秒 idle 触发
10 分钟冷却
CI 禁用
敏感命令禁用
渲染 sponsor card
按 v/s/x 处理
```

验收：`9527 run -- sleep 10` 出现 sponsor card；按 s 跳过；按 x 关闭广告；`CI=true` 不展示广告。

## Epic 5：API Server

任务：

```txt
Fastify/Express 初始化
Prisma 连接 PostgreSQL
Redis 连接
init API
campaign next API
ad session APIs
points APIs
shop APIs
```

验收：

```txt
POST /v1/init 成功
POST /v1/ad-sessions 成功
POST /v1/ad-sessions/:id/completed 发积分
GET /v1/points/balance 返回余额
```

## Epic 6：Reward Engine

任务：

```txt
session 校验
最短停留时间
重复奖励防护
限频
写 point_ledger
更新 point_accounts
```

验收：同一 session 不能重复奖励，未满 20 秒不能奖励，超限用户不能奖励。

## Epic 7：Shop

任务：

```txt
shop_items
redemption_orders
GET /shop/items
POST /shop/redeem
扣积分
库存检查
人工审核状态
```

验收：余额足够可创建兑换订单，余额不足返回错误，库存不足返回错误。

## Epic 8：Web

任务：

```txt
首页
安装说明
广告落地页
rewards 页面
privacy
terms
```

验收：`/a/:sessionId` 可展示广告并完成 reward；`/rewards` 可展示商品。

## Epic 9：Admin

任务：

```txt
admin 登录
campaign CRUD
shop item CRUD
redemption 列表
redemption 审核
user 查询
```

验收：可创建广告、可创建商品、可审核兑换订单。

## Epic 10：部署

任务：

```txt
Vercel 部署 web
Railway/Render 部署 api
Neon/Supabase 配置 DB
Upstash 配置 Redis
npm 发布 cli
域名配置
```

验收：`npx 9527` 可调用线上 API，广告落地页可访问，Admin 可登录。
