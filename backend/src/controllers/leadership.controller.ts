import type { Request, Response } from 'express'
import { LeadershipMemberModel } from '../models/LeadershipMember.js'
import { listAllPublished } from '../utils/queryHelpers.js'
import { sendSuccess } from '../utils/respond.js'

export async function listLeadership(_req: Request, res: Response) {
  const members = await listAllPublished(LeadershipMemberModel, {}, { displayOrder: 1 })
  sendSuccess(res, members)
}
