# 02. MVP 范围

## MVP 目标

验证：

```txt
1. 开发者是否愿意在等待时主动查看广告。
2. 广告主是否愿意为开发者工作流广告付费。
3. 积分奖励成本是否低于广告收入。
```

## V1 必做功能

### CLI

- npm 安装。
- `9527 init`。
- `9527 run -- <command>`。
- `9527 balance`。
- `9527 shop`。
- 本地 config。
- command wrapper。
- idle detector。
- terminal sponsor card。
- 按键交互。

### 后端 API

- 用户初始化。
- 设备注册。
- 广告选择。
- 广告 session。
- 展示/点击/完成事件。
- 积分发放。
- 积分余额。
- 积分商城商品。
- 兑换订单。
- 基础限频。

### Web

- 官网。
- 安装说明。
- 积分规则。
- 隐私政策。
- 用户协议。
- 广告落地页 `/a/:sessionId`。
- 商城展示页 `/rewards`。

### Admin

- 登录。
- 创建广告。
- 查看广告数据。
- 创建商城商品。
- 查看兑换订单。
- 审核兑换订单。
- 查看用户积分。

## V1 不做功能

```txt
广告主自助后台
复杂广告竞价
复杂设备指纹
链上实时发币
平台币发行
回购销毁
完整 KYC
自动 USDT/USDC 提现
邀请系统
排行榜
GitHub badge
VS Code 插件
第三方 SDK
```

## V1 成功标准

```txt
安装用户：500+
完成 init：200+
周活跃用户：100+
广告 opt-in rate：10%+
广告完成率：60%+
用户关闭广告率：< 30%
至少 3 个 sponsor 愿意测试
至少 1 个 sponsor 愿意付费
```

## MVP 开发优先级

```txt
P0:
- CLI wrapper
- idle detector
- sponsor card
- API init/session/reward
- balance

P1:
- shop
- redeem
- admin campaign
- admin shop
- landing page

P2:
- rewards page
- docs
- analytics
- redemption review
```
