import { Router } from 'express'
import { listLeadership } from '../controllers/leadership.controller.js'

export const leadershipRouter = Router()
leadershipRouter.get('/leadership', listLeadership)
