import { readFile, writeFile, rename, mkdir } from "node:fs/promises"
import { dirname, resolve } from "node:path"

const channelFilePath = resolve(process.cwd(), ".notification-channels.json")

type ChannelSettings = Record<string, string>

async function readChannelSettings(): Promise<ChannelSettings> {
    try {
        const contents = await readFile(channelFilePath, "utf8")
        return JSON.parse(contents) as ChannelSettings
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return {}
        throw error
    }
}

export async function getNotificationChannelId(guildId: string): Promise<string | undefined> {
    const settings = await readChannelSettings()
    return settings[guildId]
}

export async function setNotificationChannelId(
    guildId: string,
    channelId: string
): Promise<void> {
    const settings = await readChannelSettings()
    settings[guildId] = channelId

    await mkdir(dirname(channelFilePath), { recursive: true })
    const temporaryPath = `${channelFilePath}.${process.pid}.tmp`
    await writeFile(temporaryPath, `${JSON.stringify(settings, null, 4)}\n`, "utf8")
    await rename(temporaryPath, channelFilePath)
}
