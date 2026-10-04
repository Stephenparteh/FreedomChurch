// Dropdown options for admin forms. These mirror backend/src/utils/categories.ts,
// which the API enforces. Keep the two lists in sync.
export const EVENT_CATEGORIES = ['Services', 'Bible Studies', 'Youth Events', 'Other'] as const
export const SERMON_CATEGORIES = ['Faith Series', 'Leadership Series', 'Spiritual Growth', 'Christian Living'] as const
export const GALLERY_CATEGORIES = ['Sunday Worship', 'Youth Camp', 'Community Outreach', 'Other'] as const
export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const
export const SESSION_PLATFORMS = [
  { value: 'in-person', label: 'In person' },
  { value: 'online', label: 'Online' },
  { value: 'hybrid', label: 'In person and online' },
] as const
