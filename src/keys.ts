import { getEnvVar } from "./utils/env.js"

export const Keys = {
    clientToken: getEnvVar('CLIENT_TOKEN'),
    octoToken: getEnvVar('GIT_TOKEN')
} as const // readonly keys

// export the keys
export default Keys