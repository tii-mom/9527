import { SENSITIVE_COMMANDS } from "@9527/shared";export function isCi(){return ["CI","GITHUB_ACTIONS","VERCEL","NETLIFY","RAILWAY_ENVIRONMENT","RENDER"].some(k=>process.env[k]==="true"||!!process.env[k]&&k!=="CI")}
export function isSensitiveCommand(cmd:string){const n=cmd.trim();return SENSITIVE_COMMANDS.some(s=>n===s||n.startsWith(s+" "))}
