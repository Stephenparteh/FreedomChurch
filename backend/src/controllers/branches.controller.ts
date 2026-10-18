import type { Request, Response } from 'express'
import { BranchModel } from '../models/Branch.js'
import { ApiError } from '../utils/ApiError.js'
import { getSlugParam } from '../utils/params.js'
import { getPublishedBySlug, listAllPublished } from '../utils/queryHelpers.js'
import { sendSuccess } from '../utils/respond.js'

// Same pattern as ministries: a small, hand-curated collection, not paginated.
export async function listBranches(_req: Request, res: Response) {
  const branches = await listAllPublished(BranchModel, {}, { displayOrder: 1, name: 1 })
  sendSuccess(res, branches)
}

export async function getBranch(req: Request, res: Response) {
  const branch = await getPublishedBySlug(BranchModel, getSlugParam(req.params.slug))
  if (!branch) throw ApiError.notFound('Branch not found.')
  sendSuccess(res, branch)
}
