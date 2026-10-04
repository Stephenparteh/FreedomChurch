import { Schema, model, type InferSchemaType } from 'mongoose'
import { SESSION_PLATFORMS, WEEKDAYS } from '../utils/categories.js'
import { applyJsonTransform } from './plugins.js'

/**
 * One recurring gathering (e.g. "Tuesday Bible Study", "Saturday Debate").
 * Sessions are data, not code: the church adds, edits, or hides them from
 * the admin dashboard. Nothing about a specific session is hardcoded.
 */
const serviceSessionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    dayOfWeek: { type: String, required: true, enum: WEEKDAYS },
    startTime: { type: String, required: true, trim: true, match: /^\d{2}:\d{2}$/ },
    endTime: { type: String, trim: true, match: /^\d{2}:\d{2}$/ },
    platform: { type: String, required: true, enum: SESSION_PLATFORMS, default: 'in-person' },
    locationName: { type: String, trim: true, maxlength: 200 },
    meetingUrl: { type: String, trim: true, maxlength: 500 },
    description: { type: String, trim: true, maxlength: 2000 },
    displayOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
)

serviceSessionSchema.index({ isPublished: 1, displayOrder: 1 })

applyJsonTransform(serviceSessionSchema)

export type ServiceSession = InferSchemaType<typeof serviceSessionSchema>
export const ServiceSessionModel = model('ServiceSession', serviceSessionSchema)
