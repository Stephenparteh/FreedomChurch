import { Router } from 'express'
import { login, logout, me } from '../controllers/auth.controller.js'
import { loginRateLimiter } from '../middleware/rateLimiter.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { validateBody } from '../middleware/validate.js'
import { loginSchema } from '../utils/validators.js'

export const authRouter = Router()
authRouter.post('/login', loginRateLimiter, validateBody(loginSchema), login)
authRouter.get('/me', requireAuth, me)
authRouter.post('/logout', requireAuth, logout)
