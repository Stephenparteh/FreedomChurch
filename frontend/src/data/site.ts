import type { NavLink } from '@/types/content'

/**
 * Route/brand constants only. Church-wide *content* (motto, contact
 * details, service times) now comes from the backend's SiteSetting model
 * via useSiteSettings() — see docs/API.md — not from a static file, so it
 * can be confirmed and updated without a redeploy once Milestone 4's
 * dashboard exists.
 */
export const siteConfig = {
  name: 'National Freedom Pentecostal Church',
  shortName: 'NFPC',
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
