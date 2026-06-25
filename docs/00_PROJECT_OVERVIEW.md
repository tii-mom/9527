# 00. 项目总览

## 项目名称

9527。

## 一句话定位

9527 is a rewarded sponsor layer for AI coding workflows. Developers earn credits while their AI agent is thinking.

中文：9527 是一个面向 AI 编码工作流的命令行奖励层，让开发者在等待 AI 生成代码、构建和测试时获得积分奖励。

## 核心用户

- Claude Code / Codex CLI 用户
- Cursor / Windsurf / Replit Agent 用户
- 高频使用 npm/pnpm/yarn 的开发者
- AI app、SaaS、Web3、DevOps 开发者

## 核心场景

```bash
9527 run -- npm install
9527 run -- npm test
9527 run -- npm run build
9527 run -- claude
9527 run -- codex
```

当子命令仍在运行且 stdout/stderr 超过一定时间没有输出时，CLI 展示 sponsor card。

## 核心闭环

```txt
开发者等待时间 -> 终端 sponsor 广告 -> 用户主动查看 -> 平台获得广告收入 -> 用户获得积分 -> 积分商城兑换 AI/dev 权益 -> 用户留存和传播 -> 更多广告库存
```

## V1 原则

- 透明，不偷偷运行。
- 主动，不强制展示。
- 短小，不污染终端。
- 积分先行，提现后置。
- 不承诺收益，不主打炒币。
- 服务端记账，客户端不可信。

## V1 不做

- 不发行平台币。
- 不承诺代币升值。
- 不做回购销毁。
- 不在 postinstall 阶段展示广告。
- 不作为其他 npm 包依赖偷偷展示广告。
- 不默认自动打开浏览器。
- 不读取/上传用户源码。
- 不在 CI 中展示广告。
- 不做广告主自助后台。
- 不做复杂 KYC。
