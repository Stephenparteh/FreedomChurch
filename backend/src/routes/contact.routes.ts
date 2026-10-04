import { Router } from 'express'
import { submitContact } from '../controllers/contact.controller.js'
import { contactRateLimiter } from '../middleware/rateLimiter.js'
import { validateBody } from '../middleware/validate.js'
import { contactSubmissionSchema } from '../utils/validators.js'

export const contactRouter = Router()
contactRouter.post('/contact', contactRateLimiter, validateBody(contactSubmissionSchema), submitContact)
