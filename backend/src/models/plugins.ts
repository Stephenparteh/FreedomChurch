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
