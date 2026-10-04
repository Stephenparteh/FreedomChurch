import type { NextFunction, Request, Response } from 'express'
import { ApiError } from '../utils/ApiError.js'
import { openImage, UPLOAD_NAME_PATTERN } from './storage.js'

/**
 * Public, read-only image delivery. Only server-generated names match, so
 * there's no path traversal and no way to reach anything except uploads.
 * Names are unique and never change, so the response is cached for a year.
 */
export async function serveUpload(req: Request, res: Response, next: NextFunction) {
  try {
    const name = req.params.name
    if (typeof name !== 'string' || !UPLOAD_NAME_PATTERN.test(name)) {
      throw ApiError.notFound('File not found.', 'NOT_FOUND')
    }
    const image = await openImage(name)
    if (!image) throw ApiError.notFound('File not found.', 'NOT_FOUND')

    res.setHeader('Content-Type', image.contentType)
    res.setHeader('Content-Length', String(image.length))
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    image.stream.on('error', next)
    image.stream.pipe(res)
  } catch (err) {
    next(err)
  }
}
