#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const cli = ["node", "packages/cli/dist/index.js"];
const run = (cmd, args, options = {}) => {
  console.log(`$ ${cmd} ${args.join(" ")}`);
  const result = spawnSync(cmd, args, { stdio: "inherit", env: process.env, ...options });
  if (result.status !== 0) process.exit(result.status ?? 1);
};

console.log("Manual smoke prerequisites: API on :3000, Web on :3001, DB pushed/seeded.");
run(cli[0], [...cli.slice(1), "init"]);
console.log("Run the following interactive command, press v on the sponsor card, open the printed landing URL, wait 20s, and complete:");
console.log("node packages/cli/dist/index.js run -- sleep 10");
console.log("Then verify:");
console.log("node packages/cli/dist/index.js balance");
console.log("node packages/cli/dist/index.js shop");
console.log("node packages/cli/dist/index.js redeem item_model_100k --email dev@example.com");
