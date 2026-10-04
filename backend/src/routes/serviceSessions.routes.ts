import { Router, type Request, type Response } from 'express'
import { ServiceSessionModel } from '../models/ServiceSession.js'
import { listAllPublished } from '../utils/queryHelpers.js'
import { sendSuccess } from '../utils/respond.js'

export const serviceSessionsRouter = Router()

// Published recurring sessions, in the order the church chose. Not paginated: this list stays short.
serviceSessionsRouter.get('/service-sessions', async (_req: Request, res: Response) => {
  sendSuccess(res, await listAllPublished(ServiceSessionModel, {}, { displayOrder: 1, name: 1 }))
})
