import type { Request, Response } from 'express'
import { ServiceUnitModel } from '../models/ServiceUnit.js'
import { MinistryModel } from '../models/Ministry.js'
import { ApiError } from '../utils/ApiError.js'
import { getSlugParam } from '../utils/params.js'
import { getPublishedBySlug, listAllPublished } from '../utils/queryHelpers.js'
import { sendSuccess } from '../utils/respond.js'

export async function listServiceUnits(req: Request, res: Response) {
  const filter: Record<string, unknown> = {}
  if (typeof req.query.ministry === 'string') {
    const ministry = await MinistryModel.findOne({ slug: req.query.ministry, isPublished: true })
    // An unknown ministry slug is a filter with no matches, not an error.
    if (!ministry) {
      sendSuccess(res, [])
      return
    }
    filter.ministry = ministry._id
  }
  const units = await listAllPublished(ServiceUnitModel, filter, { name: 1 })
  sendSuccess(res, units)
}

export async function getServiceUnit(req: Request, res: Response) {
  const unit = await getPublishedBySlug(ServiceUnitModel, getSlugParam(req.params.slug))
  if (!unit) throw ApiError.notFound('Service unit not found.')
  sendSuccess(res, unit)
}
