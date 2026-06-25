# 01. 产品规格说明

## 用户故事

### 开发者

作为开发者，我希望在等待 AI agent、测试、构建或部署时，可以选择查看一条开发者相关赞助信息，从而获得积分，用来兑换模型 token、AI 工具额度或云服务 credit。

### 广告主

作为开发者工具广告主，我希望我的产品在开发者真实工作流中曝光，并且能按展示、点击、注册或有效转化付费。

### 平台运营者

作为平台运营者，我希望能够手动创建广告、设置奖励、查看效果、管理用户积分和处理商城兑换。

## 首次使用

```bash
npx 9527
```

引导：

```txt
Welcome to 9527.
Earn developer credits while your AI agent is thinking.
? Continue with email or GitHub
? Enable sponsor rewards during idle time
? Start with anonymous mode first
```

## 日常使用

```bash
9527 run -- npm run build
```

子命令长时间无输出时：

```txt
╭────────────────────────────────────────────╮
│ Sponsor · Neon                             │
│ Serverless Postgres for AI apps.           │
│ [v] View +8 pts   [s] Skip   [x] Off       │
╰────────────────────────────────────────────╯
```

按 `v` 后：

```txt
Sponsor link:
https://9527.dev/a/session-id

Stay for 20s to unlock +8 points.
Complete signup to earn up to +500 points.
```

## 命令列表

```txt
9527 init
9527 run -- <command>
9527 balance
9527 shop
9527 redeem
9527 config
9527 enable
9527 disable
9527 version
```

## 体验底线

- 广告必须明确标注 Sponsor / Sponsored。
- 不伪装成系统输出。
- 不伪装成 npm 输出。
- 不遮挡命令输出。
- 不清屏。
- 不默认跳浏览器。
- 不阻塞子进程。
- 不改变原命令退出码。
- 用户可随时关闭。
