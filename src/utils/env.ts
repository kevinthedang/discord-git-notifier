import { resolve } from "path"
import { config } from "dotenv"

// Find config - works with Nodemon
const envFile = process.env.NODE_ENV === "development" ? ".dev.env" : ".env"

// resolve config file
const envFilePath = resolve(process.cwd(), envFile)

// set current environemnt variable file
config({ path: envFilePath })

// Getter for environment variables
export function getEnvVar(name: string, fallback?: string): string {
    const value = process.env[name] ?? fallback
    if (value == undefined)
        throw new Error(`Environment variable ${name} is not set.`)

    // return env variable
    return value
}