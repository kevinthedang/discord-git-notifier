import { event, Events } from '../utils/index.js'

// Log when bot successfully logs in
export default event(Events.ClientReady, ({ log }, client) => {
    return log(`Logged in as ${client.user.username}.`)
})