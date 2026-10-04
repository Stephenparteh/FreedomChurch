import { Router } from 'express'
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
apiRouter.use(serviceUnitsRouter)
apiRouter.use(galleryRouter)
apiRouter.use(leadershipRouter)
apiRouter.use(siteSettingsRouter)
apiRouter.use(contactRouter)
