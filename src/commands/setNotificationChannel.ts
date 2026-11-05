import {
    ApplicationCommandType,
    PermissionFlagsBits,
    type ChatInputCommandInteraction,
    type Client
} from "discord.js"
import type { SlashCommand } from "../utils/commands.js"
import { setNotificationChannelId } from "../utils/notificationChannels.js"

export const SetNotificationChannel: SlashCommand = {
    type: ApplicationCommandType.ChatInput,
    name: "set-notification-channel",
    description: "Set this channel as the server notification channel",
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.ManageChannels,
    run: async (_client: Client, interaction: ChatInputCommandInteraction) => {
        if (!interaction.inGuild() || !interaction.guildId) {
            await interaction.reply({
                content: "This command can only be used in a server.",
                ephemeral: true
            })
            return
        }

        if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageChannels)) {
            await interaction.reply({
                content: "You need the Manage Channels permission to change the notification channel.",
                ephemeral: true
            })
            return
        }

        await setNotificationChannelId(interaction.guildId, interaction.channelId)
        await interaction.reply({
            content: `<#${interaction.channelId}> is now the notification channel.`,
            ephemeral: true
        })
    }
}
