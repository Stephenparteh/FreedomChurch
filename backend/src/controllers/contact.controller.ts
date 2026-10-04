import type { Request, Response } from 'express'
import { ContactSubmissionModel } from '../models/ContactSubmission.js'
import { sendSuccess } from '../utils/respond.js'
import type { contactSubmissionSchema } from '../utils/validators.js'
import type { z } from 'zod'

type ContactBody = z.infer<typeof contactSubmissionSchema>

export async function submitContact(req: Request, res: Response) {
  const body = req.body as ContactBody
  const submission = await ContactSubmissionModel.create(body)
  // Only confirm receipt — never echo back the stored document, since this
  // endpoint is unauthenticated and the record is otherwise admin-only.
  sendSuccess(res, { received: true, id: submission.id as string }, undefined, 201)
}
