import type { Request, Response } from 'express'
import { GalleryItemModel } from '../models/GalleryItem.js'
import { buildPaginationMeta, parsePagination } from '../utils/pagination.js'
import { listPublished } from '../utils/queryHelpers.js'
import { sendSuccess } from '../utils/respond.js'

export async function listGallery(req: Request, res: Response) {
  const { page, limit } = parsePagination(req.query as Record<string, unknown>)
  const filter: Record<string, unknown> = {}
  if (typeof req.query.category === 'string') filter.category = req.query.category

  const { items, total } = await listPublished(GalleryItemModel, filter, {
    page,
    limit,
    sort: { displayOrder: 1, createdAt: -1 },
  })
  sendSuccess(res, items, buildPaginationMeta(page, limit, total))
}
