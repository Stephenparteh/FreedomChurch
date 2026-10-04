import type { Request, Response } from 'express'
import { sendSuccess } from '../utils/respond.js'

export function uploadImage(req: Request, res: Response) {
  const file = req.file!
  // Relative, server-owned path. The frontend resolves it against the API origin.
  sendSuccess(res, { url: `/uploads/${file.filename}`, mimeType: file.mimetype, size: file.size }, undefined, 201)
}
