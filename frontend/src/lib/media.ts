import { API_ORIGIN } from '@/lib/api/client'

/**
 * Uploaded files are stored and served by the API (/uploads/…). Seeded NFPC
 * photos live with the frontend (/photos/…), and external URLs pass through.
 */
export function resolveMediaUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined
  if (url.startsWith('/uploads/')) return `${API_ORIGIN}${url}`
  return url
}
