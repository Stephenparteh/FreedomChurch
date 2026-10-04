import { Router } from 'express'
import { getServiceUnit, listServiceUnits } from '../controllers/serviceUnits.controller.js'

export const serviceUnitsRouter = Router()
serviceUnitsRouter.get('/service-units', listServiceUnits)
serviceUnitsRouter.get('/service-units/:slug', getServiceUnit)
