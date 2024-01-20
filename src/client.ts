import { Client, GatewayIntentBits } from 'discord.js'
import { registerEvents } from './utils/events.js'
import { registerOctokit } from './utils/octoclient.js'
import Events from './events/index.js'

// import keys/tokens
import Keys from './keys.js'
import { log } from 'console'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

// Setup octokit
const octokit = await registerOctokit(Keys.octoToken)

// Setup bot commands and pass references
registerEvents(client, Events, JSON.stringify(Keys), octokit)
log(`[Event: setup] Events have been registered.`)

// Try to log in the client bot
client.login(Keys.clientToken)
    .catch((error) => {
        console.error('[Login Error]', error)
        process.exit(1)
    })