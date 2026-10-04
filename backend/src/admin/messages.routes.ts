import { Router, type Request, type Response } from 'express'
import { ContactSubmissionModel } from '../models/ContactSubmission.js'
import { ApiError } from '../utils/ApiError.js'
import { buildPaginationMeta, parsePagination } from '../utils/pagination.js'
import { sendSuccess } from '../utils/respond.js'
import { messageStatusInput } from './schemas.js'

// Contact submissions are never public. Everything here sits behind requireAuth.
export const messagesRouter = Router()

messagesRouter.get('/', async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query as Record<string, unknown>)
  const filter: Record<string, unknown> = {}
  if (req.query.status === 'new' || req.query.status === 'read' || req.query.status === 'archived') {
    filter.status = req.query.status
  }
  const [items, total] = await Promise.all([
    ContactSubmissionModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    ContactSubmissionModel.countDocuments(filter),
  ])
  sendSuccess(res, items, buildPaginationMeta(page, limit, total))
})

messagesRouter.get('/:id', async (req: Request, res: Response) => {
  const doc = await ContactSubmissionModel.findById(req.params.id)
  if (!doc) throw ApiError.notFound('Message not found.')
  sendSuccess(res, doc)
})

messagesRouter.patch('/:id', async (req: Request, res: Response) => {
  const { status } = messageStatusInput.parse(req.body)
  const doc = await ContactSubmissionModel.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' })
  if (!doc) throw ApiError.notFound('Message not found.')
  sendSuccess(res, doc)
})

messagesRouter.delete('/:id', async (req: Request, res: Response) => {
  const doc = await ContactSubmissionModel.findByIdAndDelete(req.params.id)
  if (!doc) throw ApiError.notFound('Message not found.')
  sendSuccess(res, { deleted: true, id: req.params.id })
})
