/**
 * Shapes mirror the backend's Mongoose models exactly (see
 * backend/src/models/ and docs/API.md) — field names match the real API
 * response 1:1, so no translation layer is needed between fetch and render.
 */

export interface NavLink {
  label: string
  to: string
}

export interface ServiceTime {
  label: string
  day: string
  time: string
}

export interface Sermon {
  id: string
  title: string
  slug: string
  description: string
  speaker: string
  date: string
  category?: string
  thumbnail?: string
  videoUrl?: string
  audioUrl?: string
}

export interface ChurchEvent {
  id: string
  title: string
  slug: string
  description: string
  date: string
  endDate?: string
  time?: string
  location?: string
  image?: string
}

export interface Announcement {
  id: string
  title: string
  slug: string
  content: string
  image?: string
  publishedAt: string
}

export interface Ministry {
  id: string
  name: string
  slug: string
  shortDescription: string
  description: string
  image?: string
  meetingInfo?: string
  contactInfo?: string
  displayOrder: number
}

export interface ServiceUnit {
  id: string
  name: string
  slug: string
  description: string
  ministry?: string
  image?: string
}

export interface GalleryItem {
  id: string
  title?: string
  imageUrl: string
  altText: string
  caption?: string
  category?: string
  displayOrder: number
}

export interface LeadershipMember {
  id: string
  name: string
  role: string
  bio?: string
  image?: string
  displayOrder: number
}

export interface SiteSettings {
  id: string
  churchName: string
  motto?: string
  description?: string
  email?: string
  phone?: string
  address?: string
  serviceTimes: ServiceTime[]
  socials?: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  logoUrl?: string
}

export interface ContactPayload {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}
