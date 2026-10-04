import { Router } from 'express'
import { getAnnouncement, listAnnouncements } from '../controllers/announcements.controller.js'

export const announcementsRouter = Router()
announcementsRouter.get('/announcements', listAnnouncements)
announcementsRouter.get('/announcements/:slug', getAnnouncement)
