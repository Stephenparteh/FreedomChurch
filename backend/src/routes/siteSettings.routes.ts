import { Router } from 'express'
import { getSiteSettings } from '../controllers/siteSettings.controller.js'

export const siteSettingsRouter = Router()
siteSettingsRouter.get('/site-settings', getSiteSettings)
