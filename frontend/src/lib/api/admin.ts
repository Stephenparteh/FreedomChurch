import { apiFetch, apiUpload } from './client'
import type { ApiResult } from './client'
import type { PaginationMeta } from '@/types/api'

/**
 * Admin API. Every call here requires a session token; the API rejects
 * anything without one with 401 (see requireAuth on the server).
 */

export interface AdminUser {
  id: string
  email: string
  name: string
}

export interface UploadResult {
  url: string
  mimeType: string
  size: number
}

export type AdminRecord = { id: string; isPublished?: boolean; isArchived?: boolean; [key: string]: unknown }

export const adminLogin = (email: string, password: string) =>
  apiFetch<{ token: string; user: AdminUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

export const adminMe = () => apiFetch<AdminUser>('/auth/me')

export const adminLogout = () => apiFetch<{ loggedOut: boolean }>('/auth/logout', { method: 'POST' })

function query(params: Record<string, string | number | undefined>) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
  return entries.length ? `?${new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()}` : ''
}

/** Generic CRUD for each managed resource, keyed by its admin path segment. */
export function adminResource(segment: string) {
  return {
    list: (params: { page?: number; limit?: number; status?: string } = {}) =>
      apiFetch<AdminRecord[]>(`/admin/${segment}${query(params)}`) as Promise<ApiResult<AdminRecord[]> & { pagination?: PaginationMeta }>,
    get: (id: string) => apiFetch<AdminRecord>(`/admin/${segment}/${id}`),
    create: (payload: Record<string, unknown>) =>
      apiFetch<AdminRecord>(`/admin/${segment}`, { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      apiFetch<AdminRecord>(`/admin/${segment}/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    remove: (id: string) => apiFetch<{ deleted: boolean; id: string }>(`/admin/${segment}/${id}`, { method: 'DELETE' }),
  }
}

export const adminMessages = {
  list: (params: { page?: number; limit?: number; status?: string } = {}) =>
    apiFetch<AdminMessage[]>(`/admin/messages${query(params)}`),
  get: (id: string) => apiFetch<AdminMessage>(`/admin/messages/${id}`),
  setStatus: (id: string, status: 'new' | 'read' | 'archived') =>
    apiFetch<AdminMessage>(`/admin/messages/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  remove: (id: string) => apiFetch<{ deleted: boolean; id: string }>(`/admin/messages/${id}`, { method: 'DELETE' }),
}

export interface AdminMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  status: 'new' | 'read' | 'archived'
  createdAt: string
}

export const adminSettings = {
  get: () => apiFetch<Record<string, unknown>>('/admin/settings'),
  update: (payload: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>('/admin/settings', { method: 'PATCH', body: JSON.stringify(payload) }),
}

export function uploadMedia(file: File) {
  const form = new FormData()
  form.append('file', file)
  return apiUpload<UploadResult>('/admin/uploads', form)
}
