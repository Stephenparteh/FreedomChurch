import { Router } from 'express'
import { getSermon, listSermons } from '../controllers/sermons.controller.js'

export const sermonsRouter = Router()
sermonsRouter.get('/sermons', listSermons)
sermonsRouter.get('/sermons/:slug', getSermon)
