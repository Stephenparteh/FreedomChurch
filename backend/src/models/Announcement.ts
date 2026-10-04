import { Schema, model, type InferSchemaType } from 'mongoose'
import { applyJsonTransform } from './plugins.js'

const announcementSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    content: { type: String, required: true, trim: true, maxlength: 5000 },
    image: { type: String, trim: true },
    publishedAt: { type: Date, required: true, default: Date.now },
    isPublished: { type: Boolean, default: false, index: true },
    isArchived: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
)

announcementSchema.index({ isPublished: 1, isArchived: 1, publishedAt: -1 })

applyJsonTransform(announcementSchema)

export type Announcement = InferSchemaType<typeof announcementSchema>
export const AnnouncementModel = model('Announcement', announcementSchema)
