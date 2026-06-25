import { spawn } from "node:child_process";
import { IDLE_MS, SPONSOR_COOLDOWN_MS, type Campaign } from "@9527/shared";
import { ApiClient } from "./api-client.js";
import { isCi, isSensitiveCommand } from "./idle-detector.js";
import { readConfig, updateConfig } from "./local-config.js";
import { renderSponsorCard } from "./sponsor-card.js";

export async function runWrapped(args: string[]) {
  if (args.length === 0) {
    console.error("Usage: 9527 run -- <command>");
    process.exit(1);
  }

  const command = args.join(" ");
  const child = spawn(command, { stdio: ["inherit", "pipe", "pipe"], shell: true });
  let lastOutputAt = Date.now();
  let lastAdAt = 0;
  let showing = false;
  let sessionId: string | undefined;
  let landingUrl: string | undefined;

  child.stdout.on("data", (chunk) => {
    lastOutputAt = Date.now();
    process.stdout.write(chunk);
  });
  child.stderr.on("data", (chunk) => {
    lastOutputAt = Date.now();
    process.stderr.write(chunk);
  });

  const onKey = async (buf: Buffer) => {
    if (!showing) return;
    const key = buf.toString();
    if (key === "s") {
      showing = false;
      process.stdout.write("Sponsor skipped.\n");
    }
    if (key === "x") {
      updateConfig({ adsEnabled: false });
      showing = false;
      process.stdout.write("Sponsor rewards disabled. Run 9527 enable to re-enable.\n");
    }
    if (key === "v") {
      try {
        if (!sessionId) throw new Error("No session");
        const api = new ApiClient();
        await api.post(`/v1/ad-sessions/${sessionId}/viewed`, {});
        process.stdout.write(`Sponsor link:\n${landingUrl}\n\nStay for 20s to unlock points.\n`);
      } catch (error: any) {
        process.stdout.write(`Could not open sponsor: ${error.message}\n`);
      } finally {
        showing = false;
      }
    }
  };

  if (process.stdin.isTTY) {
    process.stdin.setRawMode?.(true);
    process.stdin.resume();
    process.stdin.on("data", onKey);
  }

  const timer = setInterval(async () => {
    const config = readConfig();
    if (
      showing ||
      !config.adsEnabled ||
      isCi() ||
      isSensitiveCommand(command) ||
      Date.now() - lastOutputAt < IDLE_MS ||
      Date.now() - lastAdAt < SPONSOR_COOLDOWN_MS ||
      child.exitCode !== null
    ) {
      return;
    }

    lastAdAt = Date.now();
    try {
      const api = new ApiClient();
      const next = await api.post<{ campaign: Campaign | null }>("/v1/campaigns/next", {
        deviceId: config.deviceId,
        context: { command, os: process.platform },
      });
      if (!next.campaign) return;
      const session = await api.post<{ sessionId: string; landingUrl: string }>("/v1/ad-sessions", {
        campaignId: next.campaign.id,
        deviceId: config.deviceId,
        context: { command },
      });
      sessionId = session.sessionId;
      landingUrl = session.landingUrl;
      await api.post(`/v1/ad-sessions/${sessionId}/shown`, {});
      process.stdout.write(renderSponsorCard(next.campaign));
      showing = true;
    } catch {
      // API or rendering errors must never affect the wrapped command.
    }
  }, 1000);

  child.on("exit", (code) => {
    clearInterval(timer);
    if (process.stdin.isTTY) {
      process.stdin.off("data", onKey);
      process.stdin.setRawMode?.(false);
    }
    process.exit(code ?? 0);
  });
}
