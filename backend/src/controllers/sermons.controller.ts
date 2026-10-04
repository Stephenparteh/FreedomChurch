import type { Request, Response } from 'express'
import { SermonModel } from '../models/Sermon.js'
import { ApiError } from '../utils/ApiError.js'
import { buildPaginationMeta, parsePagination } from '../utils/pagination.js'
import { getSlugParam } from '../utils/params.js'
import { getPublishedBySlug, listPublished } from '../utils/queryHelpers.js'
import { sendSuccess } from '../utils/respond.js'

export async function listSermons(req: Request, res: Response) {
  const { page, limit } = parsePagination(req.query as Record<string, unknown>)
  const filter: Record<string, unknown> = {}
  if (typeof req.query.category === 'string') filter.category = req.query.category

  const { items, total } = await listPublished(SermonModel, filter, {
    page,
    limit,
    sort: { date: -1 },
  })
  sendSuccess(res, items, buildPaginationMeta(page, limit, total))
}

export async function getSermon(req: Request, res: Response) {
  const sermon = await getPublishedBySlug(SermonModel, getSlugParam(req.params.slug))
  if (!sermon) throw ApiError.notFound('Sermon not found.')
  sendSuccess(res, sermon)
}
