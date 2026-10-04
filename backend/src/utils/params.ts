import { ApiError } from './ApiError.js'

/**
 * Express 5's route params are typed `string | string[]` (path-to-regexp
 * supports repeating segments like `:slug+`). None of our routes use that
 * syntax, so a param arriving as an array means something is malformed —
 * treated as a 400, not silently coerced.
 */
export function getSlugParam(value: string | string[]): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw ApiError.badRequest('Invalid URL parameter.', 'INVALID_PARAM')
  }
  return value
}
