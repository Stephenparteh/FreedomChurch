import type { Request, Response } from 'express'
import { saveImage } from '../media/storage.js'
import { sendSuccess } from '../utils/respond.js'

export async function uploadImage(req: Request, res: Response) {
  const file = req.file!
  const name = await saveImage(file.buffer, file.mimetype)
  // Relative, server-owned path. The frontend resolves it against the API origin.
  sendSuccess(res, { url: `/uploads/${name}`, mimeType: file.mimetype, size: file.size }, undefined, 201)
}
