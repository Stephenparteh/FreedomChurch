import type { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { ZodError } from 'zod'
import { isProduction } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'
import type { ApiErrorBody } from '../types/api.js'

interface MongoDuplicateKeyError extends Error {
  code: number
  keyValue?: Record<string, unknown>
}

function isDuplicateKeyError(err: unknown): err is MongoDuplicateKeyError {
  return err instanceof Error && 'code' in err && (err as { code: unknown }).code === 11000
}

function isBodyParserError(err: unknown): err is Error & { status: 400 | 413 } {
  return (
    err instanceof Error &&
    'type' in err &&
    typeof (err as { type: unknown }).type === 'string' &&
    ((err as { status?: unknown }).status === 400 || (err as { status?: unknown }).status === 413)
  )
}

/**
 * Single place every thrown/rejected error in the app funnels through.
 * Express 5 forwards async handler rejections here automatically.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  let statusCode = 500
  let code = 'INTERNAL_ERROR'
  let message = 'Something went wrong.'

  if (err instanceof ApiError) {
    statusCode = err.statusCode
    code = err.code
    message = err.message
  } else if (err instanceof ZodError) {
    statusCode = 400
    code = 'VALIDATION_ERROR'
    message = err.issues.map((i) => `${i.path.join('.') || 'value'}: ${i.message}`).join('; ')
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400
    code = 'VALIDATION_ERROR'
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join('; ')
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400
    code = 'INVALID_ID'
    message = `Invalid value for ${err.path}.`
  } else if (isDuplicateKeyError(err)) {
    statusCode = 409
    code = 'DUPLICATE_KEY'
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field'
    message = `A record with that ${field} already exists.`
  } else if (isBodyParserError(err)) {
    // Malformed or oversized request bodies are the client's error, not ours.
    statusCode = err.status
    code = err.status === 413 ? 'PAYLOAD_TOO_LARGE' : 'INVALID_JSON'
    message = err.status === 413 ? 'Request body is too large.' : 'Request body is not valid JSON.'
  } else if (!isProduction && err instanceof Error) {
    // Only leak the real message outside production.
    message = err.message
  }

  if (statusCode >= 500) {
    console.error('[error]', err)
  }

  const body: ApiErrorBody = { success: false, error: { message, code } }
  res.status(statusCode).json(body)
}
