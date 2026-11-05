import type { SlashCommand } from "../utils/commands.js"
import { Commits } from "./commits.js"
import { SetNotificationChannel } from "./setNotificationChannel.js"
import { ListListeners, Listen, Unlisten } from "./listen.js"

export default [
    Commits,
    SetNotificationChannel,
    Listen,
    Unlisten,
    ListListeners
] as SlashCommand[]
