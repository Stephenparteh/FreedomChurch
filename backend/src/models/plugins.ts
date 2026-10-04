import type { Schema } from 'mongoose'

/**
 * Applied to every model: reshapes the public JSON output to `id` (string)
 * instead of `_id`/`__v`, and drops `isPublished` from the response since
 * public endpoints only ever return published documents anyway — exposing
 * the flag would just leak internal model shape for no benefit.
 */
export function applyJsonTransform(schema: Schema) {
  schema.set('toJSON', {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      delete ret.isPublished
      return ret
    },
  })
}

/**
 * JSON view for admin responses: same shape as the public view, but keeps
 * `isPublished` so the dashboard can show draft/published state. Only ever
 * returned from authenticated routes.
 */
export function adminJson(doc: { toJSON: (options?: object) => unknown }) {
  return doc.toJSON({
    virtuals: true,
    transform: (_doc: unknown, ret: Record<string, unknown>) => {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      return ret
    },
  })
}
