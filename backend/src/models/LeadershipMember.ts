import { Schema, model, type InferSchemaType } from 'mongoose'
import { applyJsonTransform } from './plugins.js'

const leadershipMemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    role: { type: String, required: true, trim: true, maxlength: 120 },
    bio: { type: String, trim: true, maxlength: 3000 },
    image: { type: String, trim: true },
    socialLinks: {
      facebook: { type: String, trim: true, maxlength: 300 },
      instagram: { type: String, trim: true, maxlength: 300 },
      twitter: { type: String, trim: true, maxlength: 300 },
      website: { type: String, trim: true, maxlength: 300 },
    },
    displayOrder: { type: Number, default: 0, index: true },
    isPublished: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
)

applyJsonTransform(leadershipMemberSchema)

export type LeadershipMember = InferSchemaType<typeof leadershipMemberSchema>
export const LeadershipMemberModel = model('LeadershipMember', leadershipMemberSchema)
