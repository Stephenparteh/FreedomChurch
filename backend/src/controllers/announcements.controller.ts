import type { Request, Response } from 'express'
import { AnnouncementModel } from '../models/Announcement.js'
import { ApiError } from '../utils/ApiError.js'
import { buildPaginationMeta, parsePagination } from '../utils/pagination.js'
import { getSlugParam } from '../utils/params.js'
import { getPublishedBySlug, listPublished } from '../utils/queryHelpers.js'
import { sendSuccess } from '../utils/respond.js'

export async function listAnnouncements(req: Request, res: Response) {
  const { page, limit } = parsePagination(req.query as Record<string, unknown>)
  const { items, total } = await listPublished(AnnouncementModel, {}, {
    page,
    limit,
    sort: { publishedAt: -1 },
  })
  sendSuccess(res, items, buildPaginationMeta(page, limit, total))
}

export async function getAnnouncement(req: Request, res: Response) {
  const announcement = await getPublishedBySlug(AnnouncementModel, getSlugParam(req.params.slug))
  if (!announcement) throw ApiError.notFound('Announcement not found.')
  sendSuccess(res, announcement)
}
