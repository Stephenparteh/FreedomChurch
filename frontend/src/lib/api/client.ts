import type { ApiErrorBody, ApiSuccess, PaginationMeta } from '@/types/api'
import { getStoredToken, clearStoredToken } from '@/lib/auth/session'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

export const API_ORIGIN = new URL(API_URL, window.location.origin).origin

export const AUTH_EXPIRED_EVENT = 'nfpc:auth-expired'

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

async function parse<T>(response: Response): Promise<ApiResult<T>> {
  let body: ApiSuccess<T> | ApiErrorBody
  try {
    body = await response.json()
  } catch {
    throw new ApiClientError(response.status, 'INVALID_RESPONSE', 'The server returned an unexpected response.')
  }

  if (!response.ok || !body.success) {
    const errorBody = body as ApiErrorBody
    const error = new ApiClientError(
      response.status,
      errorBody.error?.code ?? 'UNKNOWN_ERROR',
      errorBody.error?.message ?? 'Something went wrong.',
    )
    // A rejected token means the admin session ended (expired or logged out elsewhere).
    if (response.status === 401 && getStoredToken()) {
      clearStoredToken()
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
    }
    throw error
  }

  return { data: body.data, pagination: body.pagination }
}

function authHeaders(): Record<string, string> {
  const token = getStoredToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * The only place in the frontend that calls fetch(). Components use the typed
 * functions in resources.ts and admin.ts, which go through here.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<ApiResult<T>> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...authHeaders(), ...init.headers },
    })
  } catch {
    throw new ApiClientError(0, 'NETWORK_ERROR', 'Could not reach the server. Check your connection.')
  }
  return parse<T>(response)
}

/** Multipart upload (one file). The browser sets the multipart boundary itself. */
export async function apiUpload<T>(path: string, form: FormData): Promise<ApiResult<T>> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, { method: 'POST', body: form, headers: authHeaders() })
  } catch {
    throw new ApiClientError(0, 'NETWORK_ERROR', 'Could not reach the server. Check your connection.')
  }
  return parse<T>(response)
}
