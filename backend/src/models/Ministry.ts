import { Schema, model, type InferSchemaType } from 'mongoose'
import { applyJsonTransform } from './plugins.js'

const ministrySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    shortDescription: { type: String, required: true, trim: true, maxlength: 300 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    image: { type: String, trim: true },
    meetingInfo: { type: String, trim: true, maxlength: 300 },
    contactInfo: { type: String, trim: true, maxlength: 300 },
    displayOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
)

applyJsonTransform(ministrySchema)

export type Ministry = InferSchemaType<typeof ministrySchema>
export const MinistryModel = model('Ministry', ministrySchema)
