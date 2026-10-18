import { z } from 'zod'
import {
  EVENT_CATEGORIES,
  GALLERY_CATEGORIES,
  SERMON_CATEGORIES,
  SESSION_PLATFORMS,
  WEEKDAYS,
} from '../utils/categories.js'

/**
 * Admin input schemas.
 *
 * Rules: fields the church must supply are required on create. Everything
 * else is optional, so omitted fields get the resource default (create) or
 * are left alone (update). An empty string on an optional field means
 * "clear this value" on update.
 */

const text = (max: number) => z.string().trim().max(max).optional()
const required = (max: number, label: string) =>
  z.string().trim().min(1, `${label} is required.`).max(max)
const slugField = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug may only contain lowercase letters, numbers, and single hyphens.')
  .optional()
const timeOfDay = z.string().trim().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use a 24-hour time like 18:30.')
const optionalTime = z.union([z.literal(''), timeOfDay]).optional()
const optionalUrl = z
  .union([z.literal(''), z.url({ protocol: /^https?$/, error: 'Enter a full http(s) URL.' })])
  .optional()
// Media is an external URL, a file uploaded through /api/admin/uploads (/uploads/…),
// or a bundled seeded NFPC photo (/photos/…). Anything else is rejected.
const mediaPath = z.string().regex(/^\/(uploads|photos)\/[A-Za-z0-9._\-/]+$/, 'Invalid media reference.')
const media = z.union([z.literal(''), z.url({ protocol: /^https?$/ }), mediaPath]).optional()
const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.union([z.enum(values), z.literal('')]).optional()
const bool = z.boolean().optional()
const order = z.number().int().min(0).max(10000).optional()

export const sermonInput = z.object({
  title: required(200, 'Title'),
  slug: slugField,
  description: required(5000, 'Description'),
  speaker: required(120, 'Speaker'),
  date: z.coerce.date(),
  category: optionalEnum(SERMON_CATEGORIES),
  thumbnail: media,
  videoUrl: optionalUrl,
  audioUrl: optionalUrl,
  isPublished: bool,
})

export const eventInput = z.object({
  title: required(200, 'Title'),
  slug: slugField,
  description: required(5000, 'Description'),
  date: z.coerce.date(),
  // Optional and clearable (same '' pattern as optionalUrl/optionalEnum below): unset
  // or equal to `date` means a one-day event. When present, the generic resource
  // validate() hook (see admin/resources.ts) rejects endDate < date.
  endDate: z.union([z.literal(''), z.coerce.date()]).optional(),
  startTime: optionalTime,
  endTime: optionalTime,
  category: optionalEnum(EVENT_CATEGORIES),
  location: text(200),
  rsvpUrl: optionalUrl,
  image: media,
  isPublished: bool,
})

export const galleryInput = z.object({
  title: text(150),
  imageUrl: z.union([z.url({ protocol: /^https?$/ }), mediaPath], { error: 'An image is required.' }),
  altText: required(200, 'Alt text'),
  caption: text(300),
  category: optionalEnum(GALLERY_CATEGORIES),
  displayOrder: order,
  isPublished: bool,
})

export const ministryInput = z.object({
  name: required(120, 'Name'),
  slug: slugField,
  shortDescription: required(300, 'Short description'),
  description: required(5000, 'Description'),
  image: media,
  meetingInfo: text(300),
  contactInfo: text(300),
  displayOrder: order,
  isPublished: bool,
})

export const serviceSessionInput = z.object({
  name: required(120, 'Session name'),
  slug: slugField,
  dayOfWeek: z.enum(WEEKDAYS),
  startTime: timeOfDay,
  endTime: optionalTime,
  platform: z.union([z.enum(SESSION_PLATFORMS), z.literal('')]).optional(),
  locationName: text(200),
  meetingUrl: optionalUrl,
  description: text(2000),
  displayOrder: order,
  isPublished: bool,
})

export const announcementInput = z.object({
  title: required(200, 'Title'),
  slug: slugField,
  content: required(5000, 'Content'),
  image: media,
  publishedAt: z.coerce.date().optional(),
  isPublished: bool,
  isArchived: bool,
})

export const leadershipInput = z.object({
  name: required(120, 'Name'),
  role: required(120, 'Role'),
  bio: text(3000),
  image: media,
  socialLinks: z
    .object({
      facebook: optionalUrl,
      instagram: optionalUrl,
      twitter: optionalUrl,
      website: optionalUrl,
    })
    .optional(),
  displayOrder: order,
  isPublished: bool,
})

export const branchInput = z.object({
  name: required(150, 'Name'),
  slug: slugField,
  description: required(5000, 'Description'),
  address: text(300),
  phone: text(60),
  email: z.union([z.literal(''), z.email({ error: 'Enter a valid email address.' })]).optional(),
  history: text(3000),
  serviceTimes: text(1000),
  leadershipInfo: text(500),
  image: media,
  displayOrder: order,
  isPublished: bool,
})

export const messageStatusInput = z.object({
  status: z.enum(['new', 'read', 'archived']),
})

export const settingsInput = z.object({
  churchName: required(200, 'Church name').optional(),
  motto: text(200),
  description: text(1000),
  email: z.union([z.literal(''), z.email({ error: 'Enter a valid email address.' })]).optional(),
  phone: text(60),
  address: text(300),
  footerNote: text(500),
  socials: z
    .object({ facebook: optionalUrl, instagram: optionalUrl, twitter: optionalUrl })
    .optional(),
  // The whole list is replaced on each save (see settings.routes.ts) — simplest way to
  // let the admin add, edit, reorder, and remove methods from one array.
  givingMethods: z
    .array(
      z.object({
        title: required(120, 'Title'),
        instructions: text(1000),
      }),
    )
    .max(10, 'Up to 10 giving methods.')
    .optional(),
})
