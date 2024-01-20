import { event, Events } from "../utils/events.js"

export default event(Events.MessageCreate, async ({ log, octo }, message) => {
    // check channelId
    if (message.channelId != '1197245823759687761') {
        log('Unauthorized Channel input, aborting...')
        return
    }

    // check if not the bot, do not respond to it
    if (message.author.tag === message.client.user.tag) return

    log(`Command Received: \"${message.content}\" from ${message.author.tag}`)

    // try to grab commits from a repo, else log the error from API
    try {
        // currently will only grab commits from the default branch of a repository
        const commits = await octo.request('GET /repos/{owner}/{repo}/commits', {
            owner: message.author.tag,
            repo: message.content,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        log(`Displaying all Commits found...`)
        message.reply(`The follow information received from \`${message.author.tag}\` for repository \`${message.content}\`:\n\n # of commits: ${commits.data.length}\n Latest Commit: \*\*${commits.data[0].commit.message}\*\*`)

        // show all commits
        // commits.data.forEach((repo) => {
        //     message.reply(`Commit ${repo.commit.message}`)
        // })
    } catch(error) {
        log(error)
        message.reply(`I am having trouble finding the repository \`${message.content}\` as owner \`${message.author.tag}\`\n\n I advise validating the repository name, ensure \`.git\` is not included with the name.`)
    }
})
