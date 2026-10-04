import { Schema, model, type InferSchemaType } from 'mongoose'
import { applyJsonTransform } from './plugins.js'

const contactSubmissionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 40 },
    subject: { type: String, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ['new', 'read', 'archived'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: true },
)

applyJsonTransform(contactSubmissionSchema)

export type ContactSubmission = InferSchemaType<typeof contactSubmissionSchema>
export const ContactSubmissionModel = model('ContactSubmission', contactSubmissionSchema)
