# 08. 广告系统

## 广告形式

V1 只做 terminal sponsor card。

```txt
╭────────────────────────────────────────────╮
│ Sponsor · Neon                             │
│ Serverless Postgres for AI apps.           │
│ [v] View +8 pts   [s] Skip   [x] Off       │
╰────────────────────────────────────────────╯
```

窄屏：

```txt
[Sponsor] Neon: Serverless Postgres
[v] +8 pts / [s] skip / [x] off
```

## 不做的广告形式

```txt
不做滚动文字
不做固定底栏
不清屏
不自动弹浏览器
不强制观看
不伪装成系统提示
不伪装成命令输出
```

## 展示时机

```txt
子命令仍在运行
stdout/stderr 超过 5 秒无输出
距离上次广告超过 10 分钟
用户未关闭广告
当前不是敏感命令
当前不是 CI 环境
服务端返回可展示广告
```

## 广告内容字段

```txt
sponsor_name
headline
body
target_url
reward_points
click_reward_points
cpa_reward_points
tags
budget
status
```

## 广告事件

```txt
created
shown
viewed
clicked
completed
rewarded
expired
rejected
```

## 奖励分层

```txt
展示完成：低奖励
点击链接：中奖励
注册/试用/转化：高奖励
```

示例：

```txt
View sponsor: +8 points
Click sponsor: +15 points
Sign up: +300 points
Create first project: +800 points
Paid conversion: +5000 points
```

## 广告主定向标签

```txt
language: typescript, python, rust, go, solidity
package: react, next, prisma, hardhat, langchain
command: test, build, deploy, install
tool: claude-code, codex, cursor, npm, pnpm
project_type: ai-app, web3, saas, devops, data
geo: country-level only
device: mac, linux, windows
```

## V1 广告售卖方式

```txt
人工 sponsor slot
固定周包
CPM 测试
CPC 测试
CPA 测试
```

价格建议：

```txt
Sponsor slot: $500-$2,000 / week
CPM: $10-$30
CPC: $1-$5
CPA: 按广告主任务协商
```

## 禁止广告

```txt
赌博
成人
武器
恶意软件
钓鱼网站
虚假 crypto 收益
未注册融资
高风险金融产品
仿冒工具
诱导下载未知二进制文件
```

## 广告文案要求

```txt
必须标注 Sponsor
不得夸大收益
不得伪装系统输出
不得恐吓用户
不得诱导用户输入私钥/API key
不得要求用户下载不明二进制
```
