import mongoose from 'mongoose'
import { connectDb, disconnectDb } from '../src/config/db.js'

export async function setupTestDb() {
  await connectDb()
}

export async function teardownTestDb() {
  await disconnectDb()
}

/** Wipes every collection between tests so they don't leak state into each other. */
export async function clearTestDb() {
  const { collections } = mongoose.connection
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})))
}
