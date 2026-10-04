import type { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from '../media/storage.js'
import { ApiError } from './ApiError.js'

const multerInstance = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_IMAGE_TYPES[file.mimetype]) {
      cb(ApiError.badRequest('Unsupported file type. Upload a JPEG, PNG, GIF, or WebP image.', 'UNSUPPORTED_FILE'))
      return
    }
    cb(null, true)
  },
}).single('file')

/**
 * Accepts one image in the `file` field. Rejects it unless the bytes match the
 * declared type, so a renamed or spoofed file never reaches storage.
 */
export function handleSingleImageUpload(req: Request, res: Response, next: NextFunction) {
  multerInstance(req, res, (err: unknown) => {
    try {
      if (err) throw toApiError(err)
      if (!req.file) throw ApiError.badRequest('No file was uploaded. Send an image in the "file" field.', 'NO_FILE')
      const type = ALLOWED_IMAGE_TYPES[req.file.mimetype]!
      if (!type.matches(req.file.buffer.subarray(0, 16))) {
        throw ApiError.badRequest('The file contents do not match an allowed image type.', 'UNSUPPORTED_FILE')
      }
      next()
    } catch (e) {
      next(e)
    }
  })
}

function toApiError(err: unknown): unknown {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return new ApiError(413, 'FILE_TOO_LARGE', 'Image must be 5 MB or smaller.')
    }
    return ApiError.badRequest('Invalid upload.', 'INVALID_UPLOAD')
  }
  return err
}
