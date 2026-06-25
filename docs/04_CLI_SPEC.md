# 04. CLI 规格

## CLI 包

```txt
包名：9527 或 @9527/cli
命令：9527
```

package.json 示例：

```json
{
  "name": "@9527/cli",
  "version": "0.1.0",
  "type": "module",
  "bin": {
    "9527": "./dist/index.js"
  },
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsup src/index.ts --format esm --dts"
  },
  "dependencies": {
    "commander": "^12.0.0"
  },
  "devDependencies": {
    "tsx": "^4.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0"
  }
}
```

## 命令设计

```txt
9527
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

## 本地配置

路径：`~/.9527/config.json`

```json
{
  "userId": "user_xxx",
  "deviceId": "device_xxx",
  "apiToken": "token_xxx",
  "adsEnabled": true,
  "apiBaseUrl": "https://api.9527.dev",
  "webBaseUrl": "https://9527.dev",
  "createdAt": "2026-06-25T00:00:00.000Z",
  "cliVersion": "0.1.0"
}
```

## run wrapper 要求

- 原命令正常执行。
- stdout/stderr 原样输出。
- stdin 继承。
- 原退出码保持不变。
- 广告失败不影响原命令。
- API 失败不影响原命令。
- CI 默认禁用广告。

伪代码：

```ts
const child = spawn(command, args, {
  stdio: ["inherit", "pipe", "pipe"],
  shell: true
})

let lastOutputAt = Date.now()
let lastAdAt = 0

child.stdout.on("data", chunk => {
  lastOutputAt = Date.now()
  process.stdout.write(chunk)
})

child.stderr.on("data", chunk => {
  lastOutputAt = Date.now()
  process.stderr.write(chunk)
})

const timer = setInterval(async () => {
  const now = Date.now()
  const idle = now - lastOutputAt > 5000
  const cooldown = now - lastAdAt > 10 * 60 * 1000

  if (child.exitCode === null && idle && cooldown) {
    lastAdAt = now
    await maybeShowSponsor()
  }
}, 1000)

child.on("exit", code => {
  clearInterval(timer)
  process.exit(code ?? 0)
})
```

## Idle Detector

触发条件：

```txt
adsEnabled = true
not CI
child still running
no output > 5 seconds
last ad > 10 minutes ago
not sensitive command
server says user eligible
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

CI 环境变量：

```txt
CI=true
GITHUB_ACTIONS=true
VERCEL=true
NETLIFY=true
RAILWAY_ENVIRONMENT=true
RENDER=true
```

## Sponsor Card

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

## 按键行为

```txt
v: create/view session, show URL, optionally open browser only after confirmation
s: skip session, no reward
x: disable ads, save config adsEnabled=false
```

## 终端兼容测试

macOS Terminal、iTerm2、VS Code Terminal、Warp、Windows Terminal、Linux Terminal、tmux、ssh、NO_COLOR=1。
