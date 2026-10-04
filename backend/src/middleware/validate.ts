import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'

/** Parses and replaces req.body with the validated (and coerced) result. Throws on failure, caught by errorHandler. */
export function validateBody(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body)
    next()
  }
}
