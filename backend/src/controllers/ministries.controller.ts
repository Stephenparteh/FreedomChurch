import type { Request, Response } from 'express'
import { MinistryModel } from '../models/Ministry.js'
import { ApiError } from '../utils/ApiError.js'
import { getSlugParam } from '../utils/params.js'
import { getPublishedBySlug, listAllPublished } from '../utils/queryHelpers.js'
import { sendSuccess } from '../utils/respond.js'

// Ministries are a small, hand-curated collection — not paginated, per
// docs/BACKEND_PLAN.md's note that only genuinely growable collections
// (sermons, events, gallery, announcements) need pagination.
export async function listMinistries(_req: Request, res: Response) {
  const ministries = await listAllPublished(MinistryModel, {}, { displayOrder: 1, name: 1 })
  sendSuccess(res, ministries)
}

export async function getMinistry(req: Request, res: Response) {
  const ministry = await getPublishedBySlug(MinistryModel, getSlugParam(req.params.slug))
  if (!ministry) throw ApiError.notFound('Ministry not found.')
  sendSuccess(res, ministry)
}
