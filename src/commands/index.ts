import type { SlashCommand } from "../utils/commands.js"
import { Commits } from "./commits.js"
import { SetNotificationChannel } from "./setNotificationChannel.js"

export default [
    Commits,
    SetNotificationChannel
] as SlashCommand[]
