import { MongoMemoryServer } from 'mongodb-memory-server'
import type { TestProject } from 'vitest/node'

/**
 * Runs once for the entire test run (not per test file). Starts a single
 * ephemeral, real MongoDB instance so integration tests exercise actual
 * Mongoose/MongoDB behavior — no mocking — without needing a real Atlas
 * cluster. See docs/DATABASE.md for how this differs from production.
 */
export default async function setup({ provide }: TestProject) {
  const mongod = await MongoMemoryServer.create()
  provide('mongoUri', mongod.getUri())

  return async () => {
    await mongod.stop()
  }
}

declare module 'vitest' {
  export interface ProvidedContext {
    mongoUri: string
  }
}
