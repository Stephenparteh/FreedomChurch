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
  startTime?: string
  endTime?: string
  category?: string
  location?: string
  rsvpUrl?: string
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

export interface Branch {
  id: string
  name: string
  slug: string
  description: string
  address?: string
  phone?: string
  email?: string
  history?: string
  serviceTimes?: string
  leadershipInfo?: string
  image?: string
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
  socialLinks?: {
    facebook?: string
    instagram?: string
    twitter?: string
    website?: string
  }
  displayOrder: number
}

export interface ServiceSession {
  id: string
  name: string
  slug: string
  dayOfWeek: string
  startTime: string
  endTime?: string
  platform: 'in-person' | 'online' | 'hybrid'
  locationName?: string
  meetingUrl?: string
  description?: string
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
  footerNote?: string
  socials?: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  logoUrl?: string
  givingMethods?: GivingMethod[]
}

export interface GivingMethod {
  title: string
  instructions?: string
}

export interface ContactPayload {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}
