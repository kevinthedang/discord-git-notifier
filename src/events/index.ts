import { Event } from '../utils/index.js'
import notifygit from './notifygit.js'
import ready from './ready.js'

// Centralized export for all events
export default [
    ready,
    notifygit
] as Event[] // static is better ts practice, dynamic exporting is possible