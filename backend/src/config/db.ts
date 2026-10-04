import mongoose from 'mongoose'
import { env } from './env.js'

let connected = false

export function isDbConnected(): boolean {
  return connected && mongoose.connection.readyState === 1
}

/**
 * Connects once at startup. Deliberately does NOT catch-and-continue on
 * failure — an app that can't reach its database should fail loudly at
 * boot, not serve requests pretending data will show up later.
 */
export async function connectDb(): Promise<void> {
  mongoose.connection.on('connected', () => {
    connected = true
    console.log('[db] connected')
  })
  mongoose.connection.on('disconnected', () => {
    connected = false
    console.warn('[db] disconnected')
  })
  mongoose.connection.on('error', (err) => {
    connected = false
    console.error('[db] connection error:', err.message)
  })

  try {
    await mongoose.connect(env.MONGODB_URI)
  } catch (err) {
    // Never log the connection string itself — it may contain credentials.
    const message = err instanceof Error ? err.message : 'unknown error'
    console.error(`[db] failed to connect: ${message}`)
    throw err
  }
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect()
  connected = false
}
