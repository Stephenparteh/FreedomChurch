import rateLimit from 'express-rate-limit'

/** Applied only to POST /api/contact — the one public write endpoint. */
export const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many messages sent. Please try again later.',
      code: 'RATE_LIMITED',
    },
  },
})

/** Limits password guessing against /api/auth/login. */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: 'Too many login attempts. Please try again later.', code: 'RATE_LIMITED' },
  },
})
