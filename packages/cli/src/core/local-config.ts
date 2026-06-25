import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";import { homedir } from "node:os";import { join } from "node:path";import { CLI_VERSION, DEFAULT_API_BASE_URL, DEFAULT_WEB_BASE_URL } from "@9527/shared";import type { LocalConfig } from "@9527/shared";
export const configDir=()=>join(homedir(),".9527"); export const configPath=()=>join(configDir(),"config.json");
export function defaultConfig():LocalConfig{return{adsEnabled:true,apiBaseUrl:process.env["9527_API_BASE_URL"]||DEFAULT_API_BASE_URL,webBaseUrl:process.env["9527_WEB_BASE_URL"]||DEFAULT_WEB_BASE_URL,cliVersion:CLI_VERSION,createdAt:new Date().toISOString()}}
export function readConfig():LocalConfig{if(!existsSync(configPath()))return defaultConfig();return{...defaultConfig(),...JSON.parse(readFileSync(configPath(),"utf8"))}}
export function writeConfig(c:LocalConfig){mkdirSync(configDir(),{recursive:true});writeFileSync(configPath(),JSON.stringify(c,null,2)+"\n")}
export function updateConfig(p:Partial<LocalConfig>){const c={...readConfig(),...p};writeConfig(c);return c}
