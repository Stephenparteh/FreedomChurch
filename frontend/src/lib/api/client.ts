import type { ApiErrorBody, ApiSuccess, PaginationMeta } from '@/types/api'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

export class ApiClientError extends Error {
  code: string
  status: number

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.code = code
  }
}

export interface ApiResult<T> {
  data: T
  pagination?: PaginationMeta
}

/**
 * Thin fetch wrapper around the backend's { success, data } / { success:
 * false, error } contract (see docs/API.md). Throws ApiClientError on any
 * failure — HTTP error, network failure, or malformed response — so
 * callers (via useApi) get a single consistent error path rather than
 * silently falling back to stale placeholder content.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })
  } catch {
    throw new ApiClientError(0, 'NETWORK_ERROR', 'Could not reach the server. Check your connection.')
  }

  let body: ApiSuccess<T> | ApiErrorBody
  try {
    body = await response.json()
  } catch {
    throw new ApiClientError(response.status, 'INVALID_RESPONSE', 'The server returned an unexpected response.')
  }

  if (!response.ok || !body.success) {
    const errorBody = body as ApiErrorBody
    throw new ApiClientError(
      response.status,
      errorBody.error?.code ?? 'UNKNOWN_ERROR',
      errorBody.error?.message ?? 'Something went wrong.',
    )
  }

  return { data: body.data, pagination: body.pagination }
}
