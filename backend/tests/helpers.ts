import bcrypt from 'bcryptjs'
import type { Express } from 'express'
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
  // Every collection, including GridFS buckets created by the native driver (not registered with Mongoose).
  const collections = await mongoose.connection.db!.collections()
  await Promise.all(collections.map((c) => c.deleteMany({})))
}

export const TEST_ADMIN = { email: 'admin@example.test', name: 'Test Admin', password: 'correct-horse-battery' }

/**
 * Provisions the test admin (idempotent) and mints a session token directly.
 * Fixtures don't go through HTTP login: the login endpoint is rate limited on
 * purpose, and its own behavior is covered by auth.test.ts.
 */
export async function loginAsTestAdmin(_app: Express): Promise<string> {
  const { AdminUserModel } = await import('../src/models/AdminUser.js')
  const { signAdminToken } = await import('../src/utils/auth.js')
  const passwordHash = await bcrypt.hash(TEST_ADMIN.password, 4)
  const user = await AdminUserModel.findOneAndUpdate(
    { email: TEST_ADMIN.email },
    { $set: { name: TEST_ADMIN.name, passwordHash } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  )
  return signAdminToken(user!.id as string, user!.tokenVersion)
}
