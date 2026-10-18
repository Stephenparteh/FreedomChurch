import { Router } from 'express'
import { adminRouter } from '../admin/admin.routes.js'
import { authRouter } from './auth.routes.js'
import { branchesRouter } from './branches.routes.js'
import { serviceSessionsRouter } from './serviceSessions.routes.js'
import { announcementsRouter } from './announcements.routes.js'
import { contactRouter } from './contact.routes.js'
import { eventsRouter } from './events.routes.js'
import { galleryRouter } from './gallery.routes.js'
import { healthRouter } from './health.routes.js'
import { leadershipRouter } from './leadership.routes.js'
import { ministriesRouter } from './ministries.routes.js'
import { serviceUnitsRouter } from './serviceUnits.routes.js'
import { sermonsRouter } from './sermons.routes.js'
import { siteSettingsRouter } from './siteSettings.routes.js'

export const apiRouter = Router()

apiRouter.use(healthRouter)
apiRouter.use(sermonsRouter)
apiRouter.use(eventsRouter)
apiRouter.use(announcementsRouter)
apiRouter.use(ministriesRouter)
apiRouter.use(branchesRouter)
apiRouter.use(serviceUnitsRouter)
apiRouter.use(galleryRouter)
apiRouter.use(leadershipRouter)
apiRouter.use(siteSettingsRouter)
apiRouter.use(serviceSessionsRouter)
apiRouter.use(contactRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use('/admin', adminRouter)
