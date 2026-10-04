import type { Response } from 'express'
import type { PaginationMeta } from '../types/api.js'

export function sendSuccess<T>(res: Response, data: T, pagination?: PaginationMeta, status = 200) {
  res.status(status).json(pagination ? { success: true, data, pagination } : { success: true, data })
}
