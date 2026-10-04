import { randomUUID } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { open, unlink } from 'node:fs/promises'
import path from 'node:path'
import type { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import { env } from '../config/env.js'
import { ApiError } from './ApiError.js'

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
export const UPLOAD_DIR = path.resolve(env.UPLOAD_DIR)
mkdirSync(UPLOAD_DIR, { recursive: true })

/** Only these image types are accepted. Extension is chosen by the server, never taken from the client filename. */
const ALLOWED: Record<string, { ext: string; magic: (head: Buffer) => boolean }> = {
  'image/jpeg': { ext: '.jpg', magic: (h) => h[0] === 0xff && h[1] === 0xd8 && h[2] === 0xff },
  'image/png': {
    ext: '.png',
    magic: (h) => h.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  },
  'image/gif': { ext: '.gif', magic: (h) => h.subarray(0, 4).toString('ascii') === 'GIF8' },
  'image/webp': {
    ext: '.webp',
    magic: (h) => h.subarray(0, 4).toString('ascii') === 'RIFF' && h.subarray(8, 12).toString('ascii') === 'WEBP',
  },
}

const multerInstance = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => {
      const ext = ALLOWED[file.mimetype]?.ext ?? '.bin'
      cb(null, `${randomUUID()}${ext}`)
    },
  }),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED[file.mimetype]) {
      cb(ApiError.badRequest('Unsupported file type. Upload a JPEG, PNG, GIF, or WebP image.', 'UNSUPPORTED_FILE'))
      return
    }
    cb(null, true)
  },
}).single('file')

/** Accepts one image in the `file` field, then verifies its bytes match the declared type. */
export function handleSingleImageUpload(req: Request, res: Response, next: NextFunction) {
  multerInstance(req, res, async (err: unknown) => {
    try {
      if (err) throw toApiError(err)
      if (!req.file) throw ApiError.badRequest('No file was uploaded. Send an image in the "file" field.', 'NO_FILE')

      const handle = await open(req.file.path, 'r')
      const head = Buffer.alloc(16)
      await handle.read(head, 0, 16, 0)
      await handle.close()

      if (!ALLOWED[req.file.mimetype]!.magic(head)) {
        await unlink(req.file.path)
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
