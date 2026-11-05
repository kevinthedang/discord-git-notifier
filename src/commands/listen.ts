import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    MessageFlags,
    PermissionFlagsBits,
    type ChatInputCommandInteraction,
    type Client
} from "discord.js"
import type { SlashCommand } from "../utils/commands.js"
import { addListener, getListeners, removeListener } from "../utils/listeners.js"

export const Listen: SlashCommand = {
    type: ApplicationCommandType.ChatInput,
    name: "listen",
    description: "Listen for GitHub repository push events",
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "owner",
            description: "GitHub repository owner",
            required: true
        },
        {
            type: ApplicationCommandOptionType.String,
            name: "repo",
            description: "GitHub repository name",
            required: true
        }
    ],
    run: async (_client: Client, interaction: ChatInputCommandInteraction) => {
        if (!interaction.inGuild() || !interaction.guildId) {
            await interaction.reply({
                content: "This command can only be used in a server.",
                flags: MessageFlags.Ephemeral
            })
            return
        }

        const owner = interaction.options.getString("owner", true).trim().replace(/^@/, "")
        const repo = interaction.options.getString("repo", true).trim().replace(/\.git$/, "")
        const repository = `${owner}/${repo}`
        const added = await addListener(interaction.guildId, repository)

        await interaction.reply({
            content: added
                ? `Now listening for pushes to **${repository}**.`
                : `This server is already listening for **${repository}**.`,
            flags: MessageFlags.Ephemeral
        })
    }
}

export const Unlisten: SlashCommand = {
    type: ApplicationCommandType.ChatInput,
    name: "unlisten",
    description: "Stop listening for a GitHub repository",
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "owner",
            description: "GitHub repository owner",
            required: true
        },
        {
            type: ApplicationCommandOptionType.String,
            name: "repo",
            description: "GitHub repository name",
            required: true
        }
    ],
    run: async (_client: Client, interaction: ChatInputCommandInteraction) => {
        if (!interaction.inGuild() || !interaction.guildId) return
        const owner = interaction.options.getString("owner", true).trim().replace(/^@/, "")
        const repo = interaction.options.getString("repo", true).trim().replace(/\.git$/, "")
        const repository = `${owner}/${repo}`
        const removed = await removeListener(interaction.guildId, repository)

        await interaction.reply({
            content: removed
                ? `Stopped listening for **${repository}**.`
                : `This server was not listening for **${repository}**.`,
            flags: MessageFlags.Ephemeral
        })
    }
}

export const ListListeners: SlashCommand = {
    type: ApplicationCommandType.ChatInput,
    name: "list-listeners",
    description: "List GitHub repositories this server listens to",
    dmPermission: false,
    run: async (_client: Client, interaction: ChatInputCommandInteraction) => {
        if (!interaction.inGuild() || !interaction.guildId) {
            await interaction.reply({
                content: "This command can only be used in a server.",
                flags: MessageFlags.Ephemeral
            })
            return
        }

        const repositories = await getListeners(interaction.guildId)
        await interaction.reply({
            content: repositories.length
                ? `Listening for:\n${repositories.map((repository) => `• \`${repository}\``).join("\n")}`
                : "This server is not listening for any GitHub repositories.",
            flags: MessageFlags.Ephemeral
        })
    }
}
