import { Router } from 'express'
import { getEvent, listEvents } from '../controllers/events.controller.js'

export const eventsRouter = Router()
eventsRouter.get('/events', listEvents)
eventsRouter.get('/events/:slug', getEvent)
