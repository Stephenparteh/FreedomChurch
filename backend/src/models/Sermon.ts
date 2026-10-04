import { Schema, model, type InferSchemaType } from 'mongoose'
import { applyJsonTransform } from './plugins.js'

const sermonSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    speaker: { type: String, required: true, trim: true, maxlength: 120 },
    date: { type: Date, required: true },
    category: { type: String, trim: true, maxlength: 60 },
    thumbnail: { type: String, trim: true },
    videoUrl: { type: String, trim: true },
    audioUrl: { type: String, trim: true },
    isPublished: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
)

sermonSchema.index({ isPublished: 1, date: -1 })

applyJsonTransform(sermonSchema)

export type Sermon = InferSchemaType<typeof sermonSchema>
export const SermonModel = model('Sermon', sermonSchema)
