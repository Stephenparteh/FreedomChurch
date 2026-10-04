// Dropdown options for admin forms. Values come from the legacy site's own
// categories (event.html, media.html, sermons.html) — extend here if the
// church adds more. The frontend mirrors these lists in src/lib/admin/options.ts.
export const EVENT_CATEGORIES = ['Services', 'Bible Studies', 'Youth Events', 'Other'] as const
export const SERMON_CATEGORIES = [
  'Faith Series',
  'Leadership Series',
  'Spiritual Growth',
  'Christian Living',
] as const
export const GALLERY_CATEGORIES = ['Sunday Worship', 'Youth Camp', 'Community Outreach', 'Other'] as const
export const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const
export const SESSION_PLATFORMS = ['in-person', 'online', 'hybrid'] as const
