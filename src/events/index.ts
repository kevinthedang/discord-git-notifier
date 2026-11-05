import { Event } from '../utils/index.js'
import messageCreate from './messageCreate.js'
import ready from './ready.js'
import interactionCreate from './interactionCreate.js'

// Centralized export for all events
export default [
    ready,
    messageCreate,
    interactionCreate
] as Event[] // static is better ts practice, dynamic exporting is possible