import type { NextFunction, Request, Response } from 'express'
import { AdminUserModel } from '../models/AdminUser.js'
import { ApiError } from '../utils/ApiError.js'
import { verifyAdminToken } from '../utils/auth.js'

/**
 * Protects admin write/read routes at the API layer. Checks the bearer
 * token signature and expiry, then confirms the user still exists and the
 * token's version matches — so logout (which bumps the version) takes
 * effect immediately, not when the token expires.
 */
export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    throw ApiError.unauthorized()
  }
  const payload = verifyAdminToken(header.slice('Bearer '.length).trim())
  if (!payload) throw ApiError.unauthorized()

  const user = await AdminUserModel.findById(payload.sub).select('tokenVersion email name')
  if (!user || user.tokenVersion !== payload.tv) throw ApiError.unauthorized()

  req.adminUser = { id: user.id as string, email: user.email, name: user.name }
  next()
}
