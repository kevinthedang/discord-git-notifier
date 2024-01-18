import { Octokit } from "octokit"

export async function registerOctokit(
    token: string
): Promise<Octokit> {
    // create octokit instance
    const octokit = new Octokit({ auth: token })

    // testing login of github user
    const {
        data: { login },
    } = await octokit.rest.users.getAuthenticated()

    console.log(`[Event: octokit login] Hello, ${login}`)

    return octokit
}