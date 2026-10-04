import { z } from 'zod'
import type { PaginationMeta } from '../types/api.js'

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
})

export function parsePagination(query: Record<string, unknown>) {
  const result = paginationQuerySchema.safeParse({
    page: query.page,
    limit: query.limit,
  })
  // Invalid values (e.g. ?page=abc) fall back to defaults rather than erroring
  // — pagination is a display convenience, not a required contract.
  return result.success ? result.data : { page: 1, limit: 12 }
}

export function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  }
}
