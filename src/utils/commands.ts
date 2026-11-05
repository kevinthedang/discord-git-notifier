import type {
    AutocompleteInteraction,
    Awaitable,
    ChatInputCommandInteraction,
    ChatInputApplicationCommandData,
    Client
} from "discord.js"

export interface SlashCommand extends ChatInputApplicationCommandData {
    run: (
        client: Client,
        interaction: ChatInputCommandInteraction
    ) => Awaitable<void>
    autocomplete?: (
        client: Client,
        interaction: AutocompleteInteraction
    ) => Awaitable<void>
}

export async function registerCommands(
    client: Client,
    commands: SlashCommand[]
): Promise<void> {
    if (!client.application) {
        throw new Error("Discord application is not available.")
    }
    const application = client.application

    const registeredNames = new Set(commands.map((command) => command.name))
    const fetchedCommands = await application.commands.fetch()

    await Promise.all(
        [...fetchedCommands.values()]
            .filter((command) => !registeredNames.has(command.name))
            .map((command) => command.delete())
    )

    await Promise.all(
        commands.map((command) => application.commands.create(command))
    )
}
