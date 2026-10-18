import type { ResourceConfig } from '@/components/admin/CrudPage'
import type { AdminRecord } from '@/lib/api/admin'
import {
  EVENT_CATEGORIES,
  GALLERY_CATEGORIES,
  SERMON_CATEGORIES,
  SESSION_PLATFORMS,
  WEEKDAYS,
} from '@/lib/admin/options'
import { toDateInput, toDateTimeInput } from '@/lib/admin/forms'

const today = () => toDateInput(new Date().toISOString())

function shortDate(iso: unknown): string {
  if (typeof iso !== 'string') return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

const str = (v: unknown) => (typeof v === 'string' ? v : '')

export const sermonsConfig: ResourceConfig = {
  segment: 'sermons',
  title: 'Sermons',
  noun: 'sermon',
  description: 'Sermons appear in the website library once published. Drafts are only visible here.',
  publishable: true,
  label: (r) => str(r.title),
  detail: (r) => [str(r.speaker), shortDate(r.date), str(r.category)].filter(Boolean).join(' · '),
  blank: { title: '', slug: '', speaker: '', date: today(), category: '', description: '', thumbnail: '', videoUrl: '', audioUrl: '', isPublished: false },
  fields: [
    { name: 'title', label: 'Title', kind: 'text', required: true, maxLength: 200 },
    { name: 'slug', label: 'Web address (slug)', kind: 'slug', help: 'Leave blank to create one from the title.' },
    { name: 'speaker', label: 'Preacher', kind: 'text', required: true, maxLength: 120 },
    { name: 'date', label: 'Date', kind: 'date', required: true },
    { name: 'category', label: 'Series or category', kind: 'select', options: SERMON_CATEGORIES },
    { name: 'description', label: 'Description', kind: 'textarea', required: true, maxLength: 5000 },
    { name: 'thumbnail', label: 'Thumbnail image', kind: 'image' },
    { name: 'videoUrl', label: 'Video link', kind: 'url', help: 'Full link to the video, if there is one.' },
    { name: 'audioUrl', label: 'Audio link', kind: 'url', help: 'Full link to the audio recording, if there is one.' },
    { name: 'isPublished', label: 'Published (visible on the website)', kind: 'checkbox' },
  ],
}

export const eventsConfig: ResourceConfig = {
  segment: 'events',
  title: 'Events',
  noun: 'event',
  description: 'Events appear on the website once published. Use a date and times that are confirmed with the church.',
  publishable: true,
  label: (r) => str(r.title),
  detail: (r) => {
    const dateText = r.endDate && shortDate(r.endDate) !== shortDate(r.date) ? `${shortDate(r.date)}–${shortDate(r.endDate)}` : shortDate(r.date)
    return [dateText, r.startTime ? `${str(r.startTime)}${r.endTime ? `–${str(r.endTime)}` : ''}` : '', str(r.location)]
      .filter(Boolean)
      .join(' · ')
  },
  blank: { title: '', slug: '', date: today(), endDate: '', startTime: '', endTime: '', category: '', location: '', rsvpUrl: '', description: '', image: '', isPublished: false },
  fields: [
    { name: 'title', label: 'Title', kind: 'text', required: true, maxLength: 200 },
    { name: 'slug', label: 'Web address (slug)', kind: 'slug', help: 'Leave blank to create one from the title.' },
    { name: 'date', label: 'Start date', kind: 'date', required: true },
    { name: 'endDate', label: 'End date', kind: 'date-optional', help: 'Only for multi-day events (a revival, crusade, or conference). Leave blank for a one-day event.' },
    { name: 'startTime', label: 'Starts', kind: 'time' },
    { name: 'endTime', label: 'Ends', kind: 'time' },
    { name: 'category', label: 'Category', kind: 'select', options: EVENT_CATEGORIES },
    { name: 'location', label: 'Location', kind: 'text', maxLength: 200 },
    { name: 'rsvpUrl', label: 'RSVP link', kind: 'url', help: 'Leave empty if there is no RSVP link.' },
    { name: 'description', label: 'Description', kind: 'textarea', required: true, maxLength: 5000 },
    { name: 'image', label: 'Event image', kind: 'image', help: 'Optional. No image is shown unless you add one.' },
    { name: 'isPublished', label: 'Published (visible on the website)', kind: 'checkbox' },
  ],
}

export const galleryConfig: ResourceConfig = {
  segment: 'gallery',
  title: 'Gallery',
  noun: 'photo',
  description: 'Photos appear in the public gallery in display order once published.',
  publishable: true,
  label: (r) => str(r.title) || str(r.altText),
  detail: (r) => [str(r.category), `Order ${r.displayOrder ?? 0}`].filter(Boolean).join(' · '),
  blank: { imageUrl: '', altText: '', title: '', caption: '', category: '', displayOrder: '0', isPublished: false },
  fields: [
    { name: 'imageUrl', label: 'Photo', kind: 'image', required: true, help: 'JPEG, PNG, GIF, or WebP. Up to 5 MB.' },
    { name: 'altText', label: 'Description for screen readers', kind: 'text', required: true, maxLength: 200, help: 'Briefly describe what the photo shows.' },
    { name: 'title', label: 'Title (optional)', kind: 'text', maxLength: 150 },
    { name: 'caption', label: 'Caption (optional)', kind: 'text', maxLength: 300 },
    { name: 'category', label: 'Category', kind: 'select', options: GALLERY_CATEGORIES },
    { name: 'displayOrder', label: 'Display order', kind: 'number', help: 'Lower numbers appear first.' },
    { name: 'isPublished', label: 'Published (visible on the website)', kind: 'checkbox' },
  ],
}

export const ministriesConfig: ResourceConfig = {
  segment: 'ministries',
  title: 'Ministries',
  noun: 'ministry',
  description: 'Ministries are shown on the website in display order. Only add ministries the church has confirmed.',
  publishable: true,
  label: (r) => str(r.name),
  detail: (r) => str(r.shortDescription),
  blank: { name: '', slug: '', shortDescription: '', description: '', image: '', meetingInfo: '', contactInfo: '', displayOrder: '0', isPublished: false },
  fields: [
    { name: 'name', label: 'Name', kind: 'text', required: true, maxLength: 120 },
    { name: 'slug', label: 'Web address (slug)', kind: 'slug', help: 'Leave blank to create one from the name.' },
    { name: 'shortDescription', label: 'Short description', kind: 'text', required: true, maxLength: 300 },
    { name: 'description', label: 'Full description', kind: 'textarea', required: true, maxLength: 5000 },
    { name: 'image', label: 'Image', kind: 'image' },
    { name: 'meetingInfo', label: 'When it meets', kind: 'text', maxLength: 300, help: 'The ministry’s regular meeting schedule, e.g. "Saturdays, 4:00 PM" or "First Sunday of the month."' },
    { name: 'contactInfo', label: 'Who to contact', kind: 'text', maxLength: 300, help: 'The person or way to reach them for this ministry, e.g. a name, phone number, or email.' },
    { name: 'displayOrder', label: 'Display order', kind: 'number', help: 'Lower numbers appear first.' },
    { name: 'isPublished', label: 'Published (visible on the website)', kind: 'checkbox' },
  ],
}

export const serviceSessionsConfig: ResourceConfig = {
  segment: 'service-sessions',
  title: 'Service & Bible study sessions',
  noun: 'session',
  description:
    'Each recurring gathering is its own entry, so you can add or change sessions at any time. Times and links appear on the website once published.',
  publishable: true,
  label: (r) => str(r.name),
  detail: (r) => {
    const platform = SESSION_PLATFORMS.find((p) => p.value === r.platform)?.label ?? ''
    return [str(r.dayOfWeek), str(r.startTime) + (r.endTime ? `–${str(r.endTime)}` : ''), platform].filter(Boolean).join(' · ')
  },
  blank: { name: '', slug: '', dayOfWeek: '', startTime: '', endTime: '', platform: 'in-person', locationName: '', meetingUrl: '', description: '', displayOrder: '0', isPublished: false },
  fields: [
    { name: 'name', label: 'Session name', kind: 'text', required: true, maxLength: 120, help: 'For example: Tuesday Bible Study.' },
    { name: 'slug', label: 'Web address (slug)', kind: 'slug', help: 'Leave blank to create one from the name.' },
    { name: 'dayOfWeek', label: 'Day', kind: 'select', required: true, options: WEEKDAYS },
    { name: 'startTime', label: 'Starts', kind: 'time', required: true },
    { name: 'endTime', label: 'Ends (optional)', kind: 'time' },
    { name: 'platform', label: 'Where it meets', kind: 'select', options: SESSION_PLATFORMS },
    { name: 'locationName', label: 'Location (for in-person)', kind: 'text', maxLength: 200 },
    { name: 'meetingUrl', label: 'Meeting link (for online)', kind: 'url', help: 'Leave empty if there is no online link.' },
    { name: 'description', label: 'Notes (optional)', kind: 'textarea', maxLength: 2000 },
    { name: 'displayOrder', label: 'Display order', kind: 'number', help: 'Lower numbers appear first.' },
    { name: 'isPublished', label: 'Published (visible on the website)', kind: 'checkbox' },
  ],
}

export const announcementsConfig: ResourceConfig = {
  segment: 'announcements',
  title: 'Announcements',
  noun: 'announcement',
  description: 'Published announcements appear on the website. Archive an announcement to remove it from the site while keeping the record.',
  publishable: true,
  label: (r) => str(r.title),
  detail: (r) => shortDate(r.publishedAt),
  blank: { title: '', slug: '', content: '', image: '', publishedAt: toDateTimeInput(new Date().toISOString()), isPublished: false, isArchived: false },
  fields: [
    { name: 'title', label: 'Title', kind: 'text', required: true, maxLength: 200 },
    { name: 'slug', label: 'Web address (slug)', kind: 'slug', help: 'Leave blank to create one from the title.' },
    { name: 'publishedAt', label: 'Date to show', kind: 'datetime' },
    { name: 'content', label: 'Content', kind: 'textarea', required: true, maxLength: 5000 },
    { name: 'image', label: 'Image (optional)', kind: 'image' },
    { name: 'isPublished', label: 'Published (visible on the website)', kind: 'checkbox' },
    { name: 'isArchived', label: 'Archived (hidden from the website, kept for records)', kind: 'checkbox' },
  ],
}

const SOCIAL_KEYS = ['facebook', 'instagram', 'twitter', 'website'] as const

export const teamConfig: ResourceConfig = {
  segment: 'leadership',
  title: 'Team & leadership',
  noun: 'team member',
  description: 'Add only people the church has confirmed, with their approved names, roles, and photos.',
  publishable: true,
  label: (r) => str(r.name),
  detail: (r) => str(r.role),
  blank: { name: '', role: '', bio: '', image: '', facebook: '', instagram: '', twitter: '', website: '', displayOrder: '0', isPublished: false },
  hydrate: (r) => {
    const links = (r.socialLinks ?? {}) as Record<string, string | undefined>
    const flat: AdminRecord = { ...r }
    for (const key of SOCIAL_KEYS) flat[key] = links[key] ?? ''
    return flat
  },
  prepare: (payload) => {
    const links: Record<string, string> = {}
    for (const key of SOCIAL_KEYS) {
      if (key in payload) {
        links[key] = String(payload[key])
        delete payload[key]
      }
    }
    if (Object.keys(links).length > 0) payload.socialLinks = links
    return payload
  },
  fields: [
    { name: 'name', label: 'Name', kind: 'text', required: true, maxLength: 120 },
    { name: 'role', label: 'Role or title', kind: 'text', required: true, maxLength: 120 },
    { name: 'bio', label: 'Biography (optional)', kind: 'textarea', maxLength: 3000 },
    { name: 'image', label: 'Photo', kind: 'image' },
    { name: 'facebook', label: 'Facebook link', kind: 'url' },
    { name: 'instagram', label: 'Instagram link', kind: 'url' },
    { name: 'twitter', label: 'X (Twitter) link', kind: 'url' },
    { name: 'website', label: 'Website', kind: 'url' },
    { name: 'displayOrder', label: 'Display order', kind: 'number', help: 'Lower numbers appear first.' },
    { name: 'isPublished', label: 'Published (visible on the website)', kind: 'checkbox' },
  ],
}

export const branchesConfig: ResourceConfig = {
  segment: 'branches',
  title: 'Branches',
  noun: 'branch',
  description: 'Each published branch gets its own page, linked from the Branches menu. Only add branches the church has confirmed.',
  publishable: true,
  label: (r) => str(r.name),
  detail: (r) => str(r.address),
  blank: { name: '', slug: '', description: '', address: '', phone: '', email: '', history: '', serviceTimes: '', leadershipInfo: '', image: '', displayOrder: '0', isPublished: false },
  fields: [
    { name: 'name', label: 'Branch name', kind: 'text', required: true, maxLength: 150 },
    { name: 'slug', label: 'Web address (slug)', kind: 'slug', help: 'Leave blank to create one from the name.' },
    { name: 'description', label: 'Description', kind: 'textarea', required: true, maxLength: 5000, help: 'Shown on the branch’s own page.' },
    { name: 'address', label: 'Address', kind: 'text', maxLength: 300 },
    { name: 'phone', label: 'Phone', kind: 'text', maxLength: 60 },
    { name: 'email', label: 'Email', kind: 'email' },
    { name: 'history', label: 'How this branch started (optional)', kind: 'textarea', maxLength: 3000, help: 'Only if confirmed — leave blank otherwise.' },
    { name: 'serviceTimes', label: 'Service times (optional)', kind: 'textarea', maxLength: 1000, help: 'Free text, e.g. "Sundays, 9:00 AM".' },
    { name: 'leadershipInfo', label: 'Leadership (optional)', kind: 'text', maxLength: 500, help: 'Who leads this branch, if confirmed.' },
    { name: 'image', label: 'Image', kind: 'image' },
    { name: 'displayOrder', label: 'Display order', kind: 'number', help: 'Lower numbers appear first in the Branches menu.' },
    { name: 'isPublished', label: 'Published (visible on the website)', kind: 'checkbox' },
  ],
}
