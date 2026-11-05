import { mkdir, readFile, rename, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"

const listenerFilePath = resolve(process.cwd(), ".github-listeners.json")

type ListenerSettings = Record<string, string[]>

async function readListeners(): Promise<ListenerSettings> {
    try {
        return JSON.parse(await readFile(listenerFilePath, "utf8")) as ListenerSettings
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return {}
        throw error
    }
}

async function writeListeners(settings: ListenerSettings): Promise<void> {
    await mkdir(dirname(listenerFilePath), { recursive: true })
    const temporaryPath = `${listenerFilePath}.${process.pid}.tmp`
    await writeFile(temporaryPath, `${JSON.stringify(settings, null, 4)}\n`, "utf8")
    await rename(temporaryPath, listenerFilePath)
}

export async function addListener(
    guildId: string,
    repository: string
): Promise<boolean> {
    const settings = await readListeners()
    const normalized = repository.toLowerCase()
    const repositories = settings[guildId] ?? []

    if (repositories.includes(normalized)) return false
    settings[guildId] = [...repositories, normalized]
    await writeListeners(settings)
    return true
}

export async function removeListener(
    guildId: string,
    repository: string
): Promise<boolean> {
    const settings = await readListeners()
    const normalized = repository.toLowerCase()
    const repositories = settings[guildId] ?? []
    if (!repositories.includes(normalized)) return false

    settings[guildId] = repositories.filter((item) => item !== normalized)
    await writeListeners(settings)
    return true
}

export async function getListeners(guildId: string): Promise<string[]> {
    const settings = await readListeners()
    return settings[guildId] ?? []
}

export async function getGuildIdsForRepository(repository: string): Promise<string[]> {
    const settings = await readListeners()
    const normalized = repository.toLowerCase()
    return Object.entries(settings)
        .filter(([, repositories]) => repositories.includes(normalized))
        .map(([guildId]) => guildId)
}
