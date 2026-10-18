import { Router } from 'express'
import { getBranch, listBranches } from '../controllers/branches.controller.js'

export const branchesRouter = Router()
branchesRouter.get('/branches', listBranches)
branchesRouter.get('/branches/:slug', getBranch)
