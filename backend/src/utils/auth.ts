import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

const TOKEN_TTL = '8h'

export interface TokenPayload {
  sub: string
  tv: number
}

export function signAdminToken(userId: string, tokenVersion: number): string {
  return jwt.sign({ sub: userId, tv: tokenVersion }, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: TOKEN_TTL,
  })
}

/** Returns null for any invalid, expired, or malformed token. */
export function verifyAdminToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] })
    if (typeof decoded !== 'object' || typeof decoded.sub !== 'string' || typeof decoded.tv !== 'number') {
      return null
    }
    return { sub: decoded.sub, tv: decoded.tv }
  } catch {
    return null
  }
}
