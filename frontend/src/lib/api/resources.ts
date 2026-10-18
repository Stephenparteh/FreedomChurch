import { apiFetch } from './client'
import type {
  Announcement,
  Branch,
  ChurchEvent,
  ContactPayload,
  GalleryItem,
  LeadershipMember,
  Ministry,
  ServiceUnit,
  Sermon,
  ServiceSession,
  SiteSettings,
} from '@/types/content'

export interface ListParams {
  page?: number
  limit?: number
}

function toQuery(params: object): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined)
  if (entries.length === 0) return ''
  return `?${new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()}`
}

export const getSermons = (params: ListParams & { category?: string } = {}) =>
  apiFetch<Sermon[]>(`/sermons${toQuery(params)}`)

export const getSermon = (slug: string) => apiFetch<Sermon>(`/sermons/${slug}`)

export const getEvents = (params: ListParams & { upcoming?: boolean } = {}) =>
  apiFetch<ChurchEvent[]>(`/events${toQuery(params)}`)

export const getEvent = (slug: string) => apiFetch<ChurchEvent>(`/events/${slug}`)

export const getAnnouncements = (params: ListParams = {}) =>
  apiFetch<Announcement[]>(`/announcements${toQuery(params)}`)

export const getAnnouncement = (slug: string) => apiFetch<Announcement>(`/announcements/${slug}`)

export const getMinistries = () => apiFetch<Ministry[]>('/ministries')

export const getMinistry = (slug: string) => apiFetch<Ministry>(`/ministries/${slug}`)

export const getBranches = () => apiFetch<Branch[]>('/branches')

export const getBranch = (slug: string) => apiFetch<Branch>(`/branches/${slug}`)

export const getServiceUnits = (params: { ministry?: string } = {}) =>
  apiFetch<ServiceUnit[]>(`/service-units${toQuery(params)}`)

export const getGallery = (params: ListParams & { category?: string } = {}) =>
  apiFetch<GalleryItem[]>(`/gallery${toQuery(params)}`)

export const getLeadership = () => apiFetch<LeadershipMember[]>('/leadership')

// Memoized: Header/Footer/Hero/ServiceInfo/About all read site settings
// independently on the same page load. Without this they'd each fire their
// own request for a value that's the same for all of them.
let siteSettingsCache: ReturnType<typeof apiFetch<SiteSettings>> | null = null

export function getSiteSettings() {
  siteSettingsCache ??= apiFetch<SiteSettings>('/site-settings').catch((err) => {
    siteSettingsCache = null // allow retry on next call after a failure
    throw err
  })
  return siteSettingsCache
}

export const submitContact = (payload: ContactPayload) =>
  apiFetch<{ received: boolean; id: string }>('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const getServiceSessions = () => apiFetch<ServiceSession[]>('/service-sessions')
