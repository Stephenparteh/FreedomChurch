import type { Request, Response } from 'express'
import { getOrCreateSiteSettings } from '../models/SiteSetting.js'
import { sendSuccess } from '../utils/respond.js'

export async function getSiteSettings(_req: Request, res: Response) {
  const settings = await getOrCreateSiteSettings()
  sendSuccess(res, settings)
}
