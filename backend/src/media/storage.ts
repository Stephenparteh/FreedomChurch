import { randomUUID } from 'node:crypto'
import type { Readable } from 'node:stream'
import mongoose from 'mongoose'

/**
 * Persistent media storage in MongoDB GridFS. Files live in the same Atlas
 * database as the content, so they survive redeploys without a second vendor
 * or a second secret. Only MONGODB_URI is needed.
 */

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const BUCKET_NAME = 'uploads'

interface AllowedType {
  ext: 'jpg' | 'png' | 'gif' | 'webp'
  matches: (head: Buffer) => boolean
}

/** The only image types accepted. The stored extension and content type come from here, never from the client. */
export const ALLOWED_IMAGE_TYPES: Record<string, AllowedType> = {
  'image/jpeg': { ext: 'jpg', matches: (h) => h[0] === 0xff && h[1] === 0xd8 && h[2] === 0xff },
  'image/png': {
    ext: 'png',
    matches: (h) => h.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  },
  'image/gif': { ext: 'gif', matches: (h) => h.subarray(0, 4).toString('ascii') === 'GIF8' },
  'image/webp': {
    ext: 'webp',
    matches: (h) => h.subarray(0, 4).toString('ascii') === 'RIFF' && h.subarray(8, 12).toString('ascii') === 'WEBP',
  },
}

/** Server-generated names only: a UUID plus an allowed extension. Anything else is not a valid upload reference. */
export const UPLOAD_NAME_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|gif|webp)$/

function bucket() {
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db!, { bucketName: BUCKET_NAME })
}

/** Stores an already-validated image and returns its server-generated file name. */
export async function saveImage(buffer: Buffer, mimeType: string): Promise<string> {
  const type = ALLOWED_IMAGE_TYPES[mimeType]
  if (!type) throw new Error(`Unsupported media type: ${mimeType}`)
  const name = `${randomUUID()}.${type.ext}`
  const upload = bucket().openUploadStream(name, { metadata: { contentType: mimeType } })
  await new Promise<void>((resolve, reject) => {
    upload.once('error', reject)
    upload.once('finish', () => resolve())
    upload.end(buffer)
  })
  return name
}

export interface StoredImage {
  contentType: string
  length: number
  stream: Readable
}

export async function openImage(name: string): Promise<StoredImage | null> {
  const [file] = await bucket().find({ filename: name }).limit(1).toArray()
  if (!file) return null
  return {
    contentType: (file.metadata as { contentType?: string } | undefined)?.contentType ?? 'application/octet-stream',
    length: file.length,
    stream: bucket().openDownloadStream(file._id),
  }
}

export async function deleteImage(name: string): Promise<void> {
  const files = await bucket().find({ filename: name }).toArray()
  for (const file of files) {
    await bucket().delete(file._id)
  }
}

export async function countImages(): Promise<number> {
  return mongoose.connection.db!.collection(`${BUCKET_NAME}.files`).countDocuments()
}
