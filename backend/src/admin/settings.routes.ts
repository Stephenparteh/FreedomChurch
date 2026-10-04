import { Router, type Request, type Response } from 'express'
import { getOrCreateSiteSettings, SiteSettingModel } from '../models/SiteSetting.js'
import { sendSuccess } from '../utils/respond.js'
import { settingsInput } from './schemas.js'

export const settingsRouter = Router()

settingsRouter.get('/', async (_req: Request, res: Response) => {
  sendSuccess(res, await getOrCreateSiteSettings())
})

/** Partial update of the singleton. Empty strings clear a field; omitted fields are left alone. */
settingsRouter.patch('/', async (req: Request, res: Response) => {
  const parsed = settingsInput.partial().parse(req.body) as Record<string, unknown>
  await getOrCreateSiteSettings()
  const $set: Record<string, unknown> = {}
  const $unset: Record<string, 1> = {}
  for (const [key, value] of Object.entries(parsed)) {
    if (value === undefined) continue
    if (key === 'socials' && value && typeof value === 'object') {
      for (const [social, url] of Object.entries(value as Record<string, string>)) {
        if (url === '') $unset[`socials.${social}`] = 1
        else $set[`socials.${social}`] = url
      }
    } else if (value === '') {
      $unset[key] = 1
    } else {
      $set[key] = value
    }
  }
  const doc = await SiteSettingModel.findOneAndUpdate(
    { key: 'default' },
    { $set, $unset },
    { returnDocument: 'after', runValidators: true },
  )
  sendSuccess(res, doc)
})
