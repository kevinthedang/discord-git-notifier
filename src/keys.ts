import { getEnvVar } from "./utils/env.js"

export const Keys = {
    clientToken: getEnvVar('CLIENT_TOKEN'),
    octoToken: getEnvVar('OCTOKIT_TOKEN'),
    webhookSecret: process.env.WEBHOOK_SECRET,
    webhookPort: Number(process.env.WEBHOOK_PORT ?? '3000'),
    webhookPath: process.env.WEBHOOK_PATH ?? '/github/webhook'
} as const // readonly keys

// export the keys
export default Keys