import { Router } from 'express'
import { uploadImage } from '../controllers/uploads.controller.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { handleSingleImageUpload } from '../utils/upload.js'
import { createAdminResource } from './crud.js'
import { messagesRouter } from './messages.routes.js'
import { resourceSpecs } from './resources.js'
import { settingsRouter } from './settings.routes.js'

/** Every route under /api/admin requires a valid admin session. Unauthenticated requests get 401 before any handler runs. */
export const adminRouter = Router()
adminRouter.use(requireAuth)

adminRouter.use('/sermons', createAdminResource(resourceSpecs.sermons))
adminRouter.use('/events', createAdminResource(resourceSpecs.events))
adminRouter.use('/gallery', createAdminResource(resourceSpecs.gallery))
adminRouter.use('/ministries', createAdminResource(resourceSpecs.ministries))
adminRouter.use('/service-sessions', createAdminResource(resourceSpecs.serviceSessions))
adminRouter.use('/announcements', createAdminResource(resourceSpecs.announcements))
adminRouter.use('/leadership', createAdminResource(resourceSpecs.leadership))
adminRouter.use('/branches', createAdminResource(resourceSpecs.branches))
adminRouter.use('/messages', messagesRouter)
adminRouter.use('/settings', settingsRouter)
adminRouter.post('/uploads', handleSingleImageUpload, uploadImage)
