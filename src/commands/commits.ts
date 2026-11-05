import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    type ChatInputCommandInteraction,
    type Client,
    type GuildTextBasedChannel
} from "discord.js"
import type { SlashCommand } from "../utils/commands.js"
import { getOctokit } from "../utils/octoclient.js"
import { getNotificationChannelId } from "../utils/notificationChannels.js"

export const Commits: SlashCommand = {
    type: ApplicationCommandType.ChatInput,
    name: "commits",
    description: "Show recent commits from a GitHub repository",
    dmPermission: false,
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
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        if (!interaction.inGuild() || !interaction.guildId) {
            await interaction.reply({
                content: "This command can only be used in a server.",
                ephemeral: true
            })
            return
        }

        const owner = interaction.options.getString("owner", true).trim()
        const repo = interaction.options.getString("repo", true).trim().replace(/\.git$/, "")
        const notificationChannelId = await getNotificationChannelId(interaction.guildId)

        if (!notificationChannelId) {
            await interaction.reply({
                content: "No notification channel is configured. Use `/set-notification-channel` first.",
                ephemeral: true
            })
            return
        }

        await interaction.deferReply({ ephemeral: true })

        try {
            const response = await getOctokit().request("GET /repos/{owner}/{repo}/commits", {
                owner,
                repo,
                per_page: 5,
                headers: { "X-GitHub-Api-Version": "2022-11-28" }
            })

            const channel = await client.channels.fetch(notificationChannelId)
            if (
                !channel?.isTextBased() ||
                !("guildId" in channel) ||
                channel.guildId !== interaction.guildId
            ) {
                await interaction.editReply({
                    content: "The configured notification channel is unavailable or is not a text channel."
                })
                return
            }

            const textChannel = channel as GuildTextBasedChannel
            const lines = response.data.map((commit) => {
                const message = commit.commit.message.split("\n")[0]
                const author = commit.commit.author?.name ?? commit.author?.login ?? "Unknown"
                return `• \`${commit.sha.slice(0, 7)}\` **${author}** — ${message}`
            })

            await textChannel.send({
                content: [
                    `## Recent commits for \`${owner}/${repo}\``,
                    ...lines
                ].join("\n")
            })
            await interaction.editReply({
                content: `Posted ${response.data.length} recent commits to <#${notificationChannelId}>.`
            })
        } catch (error) {
            console.error("[Command: commits]", error)
            await interaction.editReply({
                content: `Could not find \`${owner}/${repo}\`. Check the owner and repository name, and verify the bot's GitHub token has access.`
            })
        }
    }
}
