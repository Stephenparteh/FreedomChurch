import { Schema, model, type InferSchemaType } from 'mongoose'
import { applyJsonTransform } from './plugins.js'

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    date: { type: Date, required: true },
    endDate: { type: Date },
    time: { type: String, trim: true, maxlength: 100 },
    location: { type: String, trim: true, maxlength: 200 },
    image: { type: String, trim: true },
    isPublished: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
)

eventSchema.index({ isPublished: 1, date: 1 })

applyJsonTransform(eventSchema)

export type Event = InferSchemaType<typeof eventSchema>
export const EventModel = model('Event', eventSchema)
