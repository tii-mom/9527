# 12. 路线图

## Phase 0：CLI 原型，1-2 周

目标：

```txt
本地 CLI 可运行
run wrapper 可包装命令
idle detector 可检测等待
终端 sponsor card 可展示
本地 mock 积分
```

交付：

```txt
9527 run -- sleep 10
出现 sponsor card
按 v 显示 mock 链接
本地 balance 增加
```

## Phase 1：后端 MVP，2-4 周

目标：

```txt
用户 init
设备注册
广告 session
事件上报
积分账本
余额查询
```

交付：

```txt
真实 API
PostgreSQL
Redis 限频
CLI 与 API 打通
```

## Phase 2：Web / Admin，3-6 周

目标：

```txt
官网
广告落地页
Admin 后台
商城商品
兑换订单
```

交付：

```txt
9527.dev
/a/:sessionId
/admin/campaigns
/admin/shop
/admin/redemptions
```

## Phase 3：小范围测试，6-10 周

目标：

```txt
50-100 个开发者测试
3-5 个 sponsor 广告
收集 opt-in、CTR、完成率、反馈
```

交付：

```txt
测试报告
广告主反馈
用户体验问题列表
下一版优先级
```

## Phase 4：商业验证，2-3 个月

目标：

```txt
500-2000 安装用户
100-500 WAU
至少 1 个付费广告主
积分商城真实兑换
```

交付：

```txt
收入数据
奖励成本数据
转化数据
复购意愿
```

## Phase 5：V2 平台化，3-6 个月

加入：

```txt
广告主自助后台
CPA 转化追踪
邀请系统
排行榜
二维码广告
模型 token 自动发放
USDC/USDT 白名单提现
第三方 CLI SDK
VS Code 插件
```
