/**
 * Creates or updates the single admin account. Credentials come from the
 * environment, never from source:
 *   ADMIN_EMAIL=... ADMIN_NAME="..." ADMIN_PASSWORD=... npm run create-admin
 * Re-running with the same email resets that account's password and
 * invalidates existing sessions.
 */
import bcrypt from 'bcryptjs'
import { connectDb, disconnectDb } from '../config/db.js'
import { AdminUserModel } from '../models/AdminUser.js'
import { loginSchema } from '../utils/validators.js'
import { z } from 'zod'

const input = z
  .object({
    ADMIN_EMAIL: loginSchema.shape.email,
    ADMIN_NAME: z.string().trim().min(2).max(120),
    ADMIN_PASSWORD: z.string().min(12, 'ADMIN_PASSWORD must be at least 12 characters.').max(200),
  })
  .safeParse(process.env)

if (!input.success) {
  for (const issue of input.error.issues) console.error(`  - ${issue.path.join('.')}: ${issue.message}`)
  console.error('Set ADMIN_EMAIL, ADMIN_NAME, and ADMIN_PASSWORD, then re-run.')
  process.exit(1)
}
const { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } = input.data

async function main() {
  await connectDb()
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12)
  await AdminUserModel.findOneAndUpdate(
    { email: ADMIN_EMAIL },
    { $set: { name: ADMIN_NAME, passwordHash }, $inc: { tokenVersion: 1 } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  )
  console.log(`[create-admin] admin account ready for ${ADMIN_EMAIL}`)
  await disconnectDb()
}

main().catch((err) => {
  console.error('[create-admin] failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
