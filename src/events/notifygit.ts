import Keys from "../keys.js"
import { event, Events } from "../utils/events.js"

export default event(Events.MessageCreate, ({ log, keys }, message) => {
    log(`Command Received: \"${message.content}\' from ${message.author.tag}`)

    const tokens = JSON.parse(keys)

    // check channelId
    if (message.channelId != '1197245823759687761') {
        log('Unauthorized Channel input, aborting...')
        return
    }

    // check if not the bot, do not respond to it
    if (message.author.tag === message.client.user.tag) return

    // reply to user with static message for now
    message.reply(`Command Received from ${message.author.tag}`)
})

