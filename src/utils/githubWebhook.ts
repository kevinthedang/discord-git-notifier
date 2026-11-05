import { createHmac, timingSafeEqual } from "node:crypto"
import { createServer, type IncomingMessage, type ServerResponse } from "node:http"
import type { Client } from "discord.js"
import { getNotificationChannelId } from "./notificationChannels.js"
import { getGuildIdsForRepository } from "./listeners.js"

interface PushCommit {
    id: string
    message: string
    author: { name?: string; username?: string }
}

interface PushPayload {
    ref?: string
    repository?: { full_name?: string }
    head_commit?: PushCommit | null
    commits?: PushCommit[]
}

function verifySignature(payload: Buffer, signature: string | undefined, secret: string): boolean {
    if (!signature?.startsWith("sha256=")) return false

    const expected = createHmac("sha256", secret).update(payload).digest()
    const received = Buffer.from(signature.slice(7), "hex")
    return received.length === expected.length && timingSafeEqual(received, expected)
}

export function startGitHubWebhook(
    client: Client,
    secret: string,
    port: number,
    path: string,
    log: (...args: unknown[]) => void
): void {
    const server = createServer((request, response) => {
        void handleRequest(request, response, client, secret, path, log)
    })

    server.listen(port, () => {
        log(`[Webhook] Listening for GitHub pushes at ${path} on port ${port}.`)
    })
    server.on("error", (error) => log("[Webhook Error]", error))
}

async function handleRequest(
    request: IncomingMessage,
    response: ServerResponse,
    client: Client,
    secret: string,
    path: string,
    log: (...args: unknown[]) => void
): Promise<void> {
    if (request.method !== "POST" || request.url?.split("?")[0] !== path) {
        response.writeHead(404).end()
        return
    }

    const chunks: Buffer[] = []
    let payloadSize = 0
    for await (const chunk of request) {
        payloadSize += chunk.length
        if (payloadSize > 1_000_000) {
            response.writeHead(413).end("Payload too large")
            return
        }
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }

    const payload = Buffer.concat(chunks)
    const signatureHeader = request.headers["x-hub-signature-256"]
    const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader
    if (!verifySignature(payload, signature, secret)) {
        response.writeHead(401).end("Invalid signature")
        return
    }
    const eventHeader = request.headers["x-github-event"]
    const githubEvent = Array.isArray(eventHeader) ? eventHeader[0] : eventHeader
    if (githubEvent !== "push") {
        response.writeHead(200).end("Ignored event")
        return
    }

    try {
        const push = JSON.parse(payload.toString("utf8")) as PushPayload
        const repository = push.repository?.full_name
        if (!repository) {
            response.writeHead(400).end("Missing repository")
            return
        }

        const guildIds = await getGuildIdsForRepository(repository)
        for (const guildId of guildIds) {
            const channelId = await getNotificationChannelId(guildId)
            if (!channelId) continue

            const channel = await client.channels.fetch(channelId)
            if (!channel?.isTextBased() || !("guildId" in channel) || channel.guildId !== guildId) continue

            const branch = push.ref?.replace("refs/heads/", "") ?? "unknown branch"
            const commits = push.commits?.length
                ? push.commits
                : push.head_commit
                    ? [push.head_commit]
                    : []
            const lines = commits.slice(0, 10).map((commit) => {
                const name = commit.author.username ?? commit.author.name ?? "Unknown"
                return `• \`${commit.id.slice(0, 7)}\` **${name}** — ${commit.message.split("\n")[0]}`
            })

            await channel.send({
                content: [
                    `## Push to \`${repository}\` (${branch})`,
                    ...(lines.length ? lines : ["No commit details were included in the webhook payload."])
                ].join("\n")
            })
        }

        log(`[Webhook] Processed push for ${repository}.`)
        response.writeHead(200).end("Push received")
    } catch (error) {
        log("[Webhook Error]", error)
        response.writeHead(500).end("Webhook processing failed")
    }
}
