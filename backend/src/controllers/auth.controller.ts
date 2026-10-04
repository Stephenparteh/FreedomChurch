import bcrypt from 'bcryptjs'
import type { Request, Response } from 'express'
import { AdminUserModel } from '../models/AdminUser.js'
import { ApiError } from '../utils/ApiError.js'
import { signAdminToken } from '../utils/auth.js'
import { sendSuccess } from '../utils/respond.js'
import type { z } from 'zod'
import type { loginSchema } from '../utils/validators.js'

// Compared against when the email is unknown, so response timing doesn't reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync('timing-equalization-placeholder', 12)

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as z.infer<typeof loginSchema>
  const user = await AdminUserModel.findOne({ email }).select('+passwordHash tokenVersion email name')
  const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH)
  if (!user || !valid) {
    throw ApiError.unauthorized('Invalid email or password.', 'INVALID_CREDENTIALS')
  }
  sendSuccess(res, {
    token: signAdminToken(user.id as string, user.tokenVersion),
    user: { id: user.id as string, email: user.email, name: user.name },
  })
}

export function me(req: Request, res: Response) {
  sendSuccess(res, req.adminUser)
}

/** Invalidates every token issued to this user so far, server-side. */
export async function logout(req: Request, res: Response) {
  await AdminUserModel.updateOne({ _id: req.adminUser!.id }, { $inc: { tokenVersion: 1 } })
  sendSuccess(res, { loggedOut: true })
}
