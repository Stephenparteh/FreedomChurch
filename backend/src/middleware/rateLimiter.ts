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
