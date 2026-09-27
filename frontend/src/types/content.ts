/**
 * Shapes mirror the future backend models documented in docs/BACKEND_PLAN.md.
 * Defining them now lets pages consume typed placeholder data today and
 * swap in real API responses later without touching component code.
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
  preacher: string
  date: string
  series?: string
  category?: string
  description: string
  thumbnailUrl?: string
  videoUrl?: string
}

export interface ChurchEvent {
  id: string
  title: string
  date: string
  time?: string
  location?: string
  description: string
  imageUrl?: string
}

export interface Ministry {
  id: string
  name: string
  summary: string
  description: string
  imageUrl?: string
  meetingInfo?: string
}

export interface Announcement {
  id: string
  title: string
  body: string
  publishedAt: string
}

export interface GalleryItem {
  id: string
  imageUrl: string
  caption?: string
  category?: string
}

export interface LeadershipMember {
  id: string
  name: string
  role: string
  bio?: string
  photoUrl?: string
}
