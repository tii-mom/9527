# 09. Web、Admin 与部署

## 是否需要 Web

需要，但 V1 不需要完整 Web 产品。需要：

```txt
官网
广告落地页
积分规则页
隐私政策
用户协议
商城展示页
Admin 后台
```

## Web 页面

```txt
/
  首页，介绍产品和安装方式

/docs
  使用文档

/rewards
  积分商城展示

/a/:sessionId
  广告落地页

/privacy
  隐私政策

/terms
  用户协议

/admin
  内部后台
```

## 广告落地页

路径：`/a/:sessionId`

功能：

```txt
显示 sponsor 信息
记录打开
20 秒倒计时
显示广告主链接
记录点击
完成后调用 complete API
显示奖励成功
```

## Admin 后台

V1 只做内部后台。

功能：

```txt
登录
Campaign 列表
创建 Campaign
编辑 Campaign
暂停 Campaign
查看展示/点击/完成数据
Shop Item 列表
创建商品
Redemption Order 列表
审核订单
User 查询
Point Ledger 查询
```

## 推荐部署

```txt
Web/Admin：Vercel
API：Railway / Render / Fly.io
PostgreSQL：Neon / Supabase
Redis：Upstash
域名：Cloudflare
npm 包：npm registry
```

## 环境变量

### API

```env
DATABASE_URL=
REDIS_URL=
JWT_SECRET=
WEB_BASE_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
NODE_ENV=
```

### Web

```env
NEXT_PUBLIC_API_BASE_URL=
ADMIN_SESSION_SECRET=
```

### CLI

```env
9527_API_BASE_URL=
9527_WEB_BASE_URL=
```

## 最小上线清单

```txt
1. npm CLI 包已发布
2. API 已部署
3. PostgreSQL 已迁移
4. Redis 限频可用
5. Web 首页可访问
6. 广告落地页可访问
7. Admin 可登录
8. 至少 1 条 campaign
9. 至少 3 个 shop items
10. 隐私政策和用户协议上线
```
