import type { Request, Response } from 'express'
import { EventModel } from '../models/Event.js'
import { ApiError } from '../utils/ApiError.js'
import { buildPaginationMeta, parsePagination } from '../utils/pagination.js'
import { getSlugParam } from '../utils/params.js'
import { getPublishedBySlug, listPublished } from '../utils/queryHelpers.js'
import { sendSuccess } from '../utils/respond.js'

export async function listEvents(req: Request, res: Response) {
  const { page, limit } = parsePagination(req.query as Record<string, unknown>)
  const filter: Record<string, unknown> = {}
  const upcoming = req.query.upcoming === 'true'
  if (upcoming) filter.date = { $gte: new Date() }

  const { items, total } = await listPublished(EventModel, filter, {
    page,
    limit,
    sort: { date: upcoming ? 1 : -1 },
  })
  sendSuccess(res, items, buildPaginationMeta(page, limit, total))
}

export async function getEvent(req: Request, res: Response) {
  const event = await getPublishedBySlug(EventModel, getSlugParam(req.params.slug))
  if (!event) throw ApiError.notFound('Event not found.')
  sendSuccess(res, event)
}
