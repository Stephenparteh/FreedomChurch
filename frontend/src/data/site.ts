import type { NavLink, ServiceTime } from '@/types/content'

/**
 * Placeholder site-wide content for Milestone 1 page shells.
 *
 * IMPORTANT: the legacy site had conflicting/inconsistent contact details
 * across pages (e.g. "contact@nfpchurch.org" in most footers vs.
 * "nfpchurch@gmail.com" in testimonies.html; "123 Church Lane, City, Country"
 * as a placeholder vs. "Police Academy Paynesville" as a real-looking
 * address). See docs/LEGACY_AUDIT.md for the full comparison.
 *
 * Nothing here should be treated as confirmed. It exists so pages have
 * something to render; church administrators must confirm real values
 * before Milestone 2 content work begins, and eventually this file is
 * replaced entirely by data fetched from the backend (docs/BACKEND_PLAN.md).
 */

export const siteConfig = {
  name: 'National Freedom Pentecostal Church',
  shortName: 'NFPC',
  // TODO: confirm canonical contact details with church leadership.
  email: 'TODO_CONFIRM_EMAIL',
  phone: 'TODO_CONFIRM_PHONE',
  address: 'TODO_CONFIRM_ADDRESS',
  socials: {
    facebook: 'TODO_CONFIRM_URL',
    instagram: 'TODO_CONFIRM_URL',
    twitter: 'TODO_CONFIRM_URL',
  },
}

export const primaryNav: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Ministries', to: '/ministries' },
  { label: 'Sermons', to: '/sermons' },
  { label: 'Events', to: '/events' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Give', to: '/give' },
  { label: 'Contact', to: '/contact' },
]

// TODO: confirm actual service schedule; these are unverified placeholders.
export const serviceTimes: ServiceTime[] = [
  { label: 'Sunday Worship Service', day: 'Sunday', time: 'TODO_CONFIRM_TIME' },
  { label: 'Bible Study', day: 'Tuesday', time: 'TODO_CONFIRM_TIME' },
]
