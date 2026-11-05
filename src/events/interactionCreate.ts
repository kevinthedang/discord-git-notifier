import commands from "../commands/index.js"
import { event, Events } from "../utils/index.js"

export default event(Events.InteractionCreate, async ({ client, log }, interaction) => {
    if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return

    const command = commands.find((item) => item.name === interaction.commandName)
    if (!command) return

    try {
        if (interaction.isAutocomplete()) {
            await command.autocomplete?.(client, interaction)
            return
        }

        await command.run(client, interaction)
    } catch (error) {
        log('[Interaction Error]', error)
    }
})
