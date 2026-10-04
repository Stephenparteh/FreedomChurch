import { Schema, model, Types, type InferSchemaType } from 'mongoose'
import { applyJsonTransform } from './plugins.js'

/**
 * Distinct from Ministry: a Ministry is a broad, public-facing area of
 * church life (Worship, Children's, Outreach). A ServiceUnit is a smaller
 * operational team that may serve within or across ministries (e.g.
 * ushering, protocol, media/tech, choir) — common in Pentecostal church
 * structures, but NOT something the legacy site or audit confirmed NFPC
 * actually organizes itself by. This model exists because Milestone 3's
 * brief asks for it as a minimum model; it ships with zero seed data and
 * should be confirmed as relevant (or dropped) during real content entry
 * in Milestone 4 — see docs/DATABASE.md.
 */
const serviceUnitSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true, trim: true, maxlength: 3000 },
    ministry: { type: Types.ObjectId, ref: 'Ministry' },
    image: { type: String, trim: true },
    isPublished: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
)

applyJsonTransform(serviceUnitSchema)

export type ServiceUnit = InferSchemaType<typeof serviceUnitSchema>
export const ServiceUnitModel = model('ServiceUnit', serviceUnitSchema)
