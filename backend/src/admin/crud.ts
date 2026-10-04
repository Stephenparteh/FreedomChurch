import { Router, type Request, type Response } from 'express'
import type { Model } from 'mongoose'
import type { ZodType } from 'zod'
import { ApiError } from '../utils/ApiError.js'
import { slugify } from '../utils/slugify.js'
import { adminJson } from '../models/plugins.js'
import { releaseUploadIfUnreferenced } from '../media/references.js'
import { buildPaginationMeta, parsePagination } from '../utils/pagination.js'
import { sendSuccess } from '../utils/respond.js'

export interface ResourceSpec {
  // Each resource has its own document type; the factory only uses generic Mongoose operations.
  model: Model<any>
  create: ZodType
  /** Applied when creating, after validation. Keys already present in the input win. */
  defaults?: Record<string, unknown>
  sort: Record<string, 1 | -1>
  /** Fields that may hold an uploaded file reference. Replaced or deleted files are cleaned up when unused. */
  mediaFields?: string[]
  /** Generates the slug from the title when the admin leaves it blank. */
  slugFrom?: 'title' | 'name'
  notFoundMessage: string
}

function idParam(req: Request): string {
  const id = req.params.id
  if (typeof id !== 'string') throw ApiError.badRequest('Invalid id.', 'INVALID_ID')
  return id
}

/**
 * Turns a validated partial update into Mongo operators. Nested objects are
 * flattened so each sub-field is set or cleared independently; an empty
 * string or null clears the field.
 */
export function toUpdateOperators(input: Record<string, unknown>) {
  const $set: Record<string, unknown> = {}
  const $unset: Record<string, 1> = {}
  const visit = (prefix: string, obj: Record<string, unknown>) => {
    for (const [key, value] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${key}` : key
      if (value === undefined) continue
      if (value === null || value === '') $unset[path] = 1
      else if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        visit(path, value as Record<string, unknown>)
      } else $set[path] = value
    }
  }
  visit('', input)
  return { $set, $unset }
}

/**
 * Builds the standard admin endpoints for one resource: list (all statuses,
 * paginated), read, create, update (partial), delete. Every route is mounted
 * behind requireAuth by the caller.
 */
export function createAdminResource(spec: ResourceSpec): Router {
  const router = Router()
  const updateSchema = (spec.create as unknown as { partial: () => ZodType }).partial()

  router.get('/', async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query as Record<string, unknown>)
    const [items, total] = await Promise.all([
      spec.model.find({}).sort(spec.sort).skip((page - 1) * limit).limit(limit),
      spec.model.countDocuments({}),
    ])
    sendSuccess(res, items.map(adminJson), buildPaginationMeta(page, limit, total))
  })

  router.get('/:id', async (req: Request, res: Response) => {
    const doc = await spec.model.findById(idParam(req))
    if (!doc) throw ApiError.notFound(spec.notFoundMessage)
    sendSuccess(res, adminJson(doc))
  })

  router.post('/', async (req: Request, res: Response) => {
    const data = spec.create.parse(req.body) as Record<string, unknown>
    for (const key of Object.keys(data)) if (data[key] === '' || data[key] === null) delete data[key]
    if (!data.slug && spec.slugFrom) {
      const generated = slugify(String(data[spec.slugFrom] ?? ''))
      if (!generated) throw ApiError.badRequest('Could not create a URL slug from that title.', 'VALIDATION_ERROR')
      data.slug = generated
    }
    const doc = await spec.model.create({ ...spec.defaults, ...data })
    sendSuccess(res, adminJson(doc), undefined, 201)
  })

  router.patch('/:id', async (req: Request, res: Response) => {
    const parsed = updateSchema.parse(req.body) as Record<string, unknown>
    const { $set, $unset } = toUpdateOperators(parsed)
    const before = await spec.model.findById(idParam(req)).lean()
    const doc = await spec.model.findByIdAndUpdate(
      idParam(req),
      { $set, $unset },
      { returnDocument: 'after', runValidators: true },
    )
    if (!doc) throw ApiError.notFound(spec.notFoundMessage)
    for (const field of spec.mediaFields ?? []) {
      const previous = (before as Record<string, unknown> | null)?.[field]
      if (previous && previous !== (doc as unknown as Record<string, unknown>)[field]) {
        await releaseUploadIfUnreferenced(previous)
      }
    }
    sendSuccess(res, adminJson(doc))
  })

  router.delete('/:id', async (req: Request, res: Response) => {
    const doc = await spec.model.findByIdAndDelete(idParam(req)).lean()
    if (!doc) throw ApiError.notFound(spec.notFoundMessage)
    for (const field of spec.mediaFields ?? []) {
      await releaseUploadIfUnreferenced((doc as Record<string, unknown>)[field])
    }
    sendSuccess(res, { deleted: true, id: idParam(req) })
  })

  return router
}
