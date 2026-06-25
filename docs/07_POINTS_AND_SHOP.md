# 07. 积分体系与积分商城

## 设计原则

```txt
广告奖励先转化为平台积分
积分进入服务端账本
积分可在商城兑换权益
USDT/USDC/代币是后置高级兑换项
```

## 积分账户

- pending_points：待确认积分。
- available_points：可用积分。
- locked_points：风控锁定积分。
- redeemed_points：已兑换积分。
- expired_points：过期积分。

## 积分来源

```txt
观看广告完成：+3 到 +10 points
点击广告链接：+5 到 +20 points
完成注册：+100 到 +500 points
完成广告主任务：+500 到 +5000 points
邀请有效用户：+100 到 +500 points
新用户欢迎奖励：+100 pending points
```

## 积分可用时间

```txt
广告完成积分：pending 24 小时
点击积分：pending 48 小时
CPA 积分：pending 7 天
邀请积分：pending 7 天
```

定时任务每小时扫描，把符合条件的 pending 转为 available。

## 积分价值表达

不要写：`1000 points 永久等于 $1`。

建议写：积分可用于兑换商城权益，具体兑换比例以商城实时展示为准。

## 商城分类

```txt
AI 模型额度
AI 编码工具
云服务
数据库
开发者工具
Crypto 兑换
特殊任务奖励
```

## V1 推荐商品

```txt
100K model tokens
500K model tokens
AI coding credit
Cloud service credit
Database dev credit
Developer tool coupon
USDC payout waitlist
USDT payout waitlist
```

## 兑换规则

```txt
普通商品：自动兑换或人工审核
高价值商品：人工审核
USDC/USDT：白名单或 waitlist
平台代币：V2 后考虑
```

## 兑换流程

```txt
用户选择商品
  -> 检查积分余额
  -> 检查商品库存
  -> 检查地区/钱包/KYC 要求
  -> 创建 redemption_order
  -> 扣除 available_points
  -> 自动发放或进入人工审核
```

## Crypto 兑换规则

USDC/USDT 不建议 V1 全量开放。建议：

```txt
最低兑换门槛：10,000 points
仅支持白名单用户
仅支持合规地区
需要钱包验证
高风险账号人工审核
平台每周批量处理
```

## 商城利润模型

```txt
批量采购模型 token，赚批发差价
广告主赞助 coupon，平台收广告费
开发者工具 CPA 分成
USDC/USDT 提现手续费
B2B reward API 服务费
```
