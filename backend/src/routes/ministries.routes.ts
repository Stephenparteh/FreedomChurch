import { Router } from 'express'
import { getMinistry, listMinistries } from '../controllers/ministries.controller.js'

export const ministriesRouter = Router()
ministriesRouter.get('/ministries', listMinistries)
ministriesRouter.get('/ministries/:slug', getMinistry)
