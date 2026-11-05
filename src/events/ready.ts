import commands from '../commands/index.js'
import { event, Events, registerCommands } from '../utils/index.js'

// Register slash commands for every connected guild
export default event(Events.ClientReady, async ({ log }, client) => {
    log(`Logged in as ${client.user.username}.`)

    try {
        await registerCommands(client, commands)
        log('Slash commands registered.')
    } catch (error) {
        log('Failed to register slash commands.', error)
    }
})