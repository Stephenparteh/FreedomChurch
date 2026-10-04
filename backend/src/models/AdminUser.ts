import { Schema, model, type InferSchemaType } from 'mongoose'

const adminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 200 },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    passwordHash: { type: String, required: true, select: false },
    // Bumped on logout (and password change) to invalidate every token issued before it.
    tokenVersion: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
)

adminUserSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret: Record<string, unknown>) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    delete ret.passwordHash
    delete ret.tokenVersion
    return ret
  },
})

export type AdminUser = InferSchemaType<typeof adminUserSchema>
export const AdminUserModel = model('AdminUser', adminUserSchema)
