import type { ClientEvents, Awaitable, Client } from "discord.js"
import { Octokit } from "octokit"

// Export events through here to reduce imports
export { Events } from 'discord.js'

export type LogMethod = (...args: unknown[]) => void
export type EventKeys = keyof ClientEvents // only wants keys of ClientEvents object

// Event Types
export interface EventProps {
    client: Client
    log: LogMethod
    keys: string
    octo: Octokit
}

export type EventCallback<T extends EventKeys> = (
    props: EventProps,
    ...args: ClientEvents[T]
) => Awaitable<unknown> // Method can be synchronous and async, unknown so we can return anything

// Event interface
export interface Event<T extends EventKeys = EventKeys> {
    key: T
    callback: EventCallback<T>
}

// Event functions
export function event<T extends EventKeys>(
    key: T,
    callback: EventCallback<T>
): Event<T> {
    return { key, callback }
}

export function registerEvents(
    client: Client, 
    events: Event[],
    keys: string,
    octo: Octokit
): void {
    for (const { key, callback } of events) {
        client.on(key, (...args) => {
            // Create a new log method for this event
            const log = console.log.bind(console, `[Event: ${key}]`)

            // Handle errors, callbacks, and logs
            try {
                callback({ client, log, keys, octo }, ...args)
            } catch (error) {
                log('[Uncaught Error]', error)
            }
        })
    }
}