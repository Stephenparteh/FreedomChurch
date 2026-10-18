import { Schema, model, type InferSchemaType } from 'mongoose'
import { applyJsonTransform } from './plugins.js'

/**
 * One NFPC church branch/location. No branch records are seeded — the church
 * supplies real names, addresses, and descriptions through the admin dashboard.
 */
const branchSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    address: { type: String, trim: true, maxlength: 300 },
    phone: { type: String, trim: true, maxlength: 60 },
    email: { type: String, trim: true, maxlength: 200 },
    // Free-text, like Ministry.meetingInfo and SiteSetting.givingMethods[].instructions —
    // each branch's history, schedule, and leadership are different, unconfirmed shapes.
    history: { type: String, trim: true, maxlength: 3000 },
    serviceTimes: { type: String, trim: true, maxlength: 1000 },
    leadershipInfo: { type: String, trim: true, maxlength: 500 },
    image: { type: String, trim: true },
    displayOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
)

branchSchema.index({ isPublished: 1, displayOrder: 1 })

applyJsonTransform(branchSchema)

export type Branch = InferSchemaType<typeof branchSchema>
export const BranchModel = model('Branch', branchSchema)
