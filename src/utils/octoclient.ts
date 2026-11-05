import { Octokit } from "octokit"

let octokit: Octokit | undefined

export async function registerOctokit(
    token: string
): Promise<Octokit> {
    // create octokit instance
    octokit = new Octokit({
        timeZone: 'America/Los_Angeles',
        auth: token 
    })

    // testing login of github user
    const {
        data: { login },
    } = await octokit.rest.users.getAuthenticated()

    console.log(`[Event: octokit setup] Signed in as ${login}`)

    return octokit
}

export function getOctokit(): Octokit {
    if (!octokit)
        throw new Error("Octokit has not been initialized.")
    return octokit
}