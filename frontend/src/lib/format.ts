/**
 * Developer placeholders (TODO_CONFIRM_*) can exist in the database until the
 * church supplies real text. Public screens call this so they are never shown.
 */
export function visibleText(value: string | undefined | null): string {
  if (!value) return ''
  return value.trimStart().startsWith('TODO_CONFIRM') ? '' : value
}

/** Shared date formatting for public and admin screens. Returns '' for invalid input. */

export function formatLongDate(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
}

/**
 * The effective last moment of an event, for "is this still upcoming" checks.
 * A multi-day event isn't finished until its end date, not its start date.
 */
export function effectiveEventEnd(event: { date: string; endDate?: string }): number {
  const end = event.endDate ? new Date(event.endDate).getTime() : NaN
  return Number.isNaN(end) ? new Date(event.date).getTime() : end
}

/** Split date for editorial "day block" layouts: month, day, weekday, year. */
export function dateParts(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return {
    month: d.toLocaleDateString(undefined, { month: 'short' }),
    day: d.getDate().toString(),
    weekday: d.toLocaleDateString(undefined, { weekday: 'long' }),
    year: d.getFullYear().toString(),
  }
}

/**
 * Compact date, extended to a range for multi-day events — same convention as
 * dateParts (short month), e.g. "12 Oct 2026", "10–12 Oct 2026", or "30 Oct – 2 Nov 2026".
 * Falls back to the single date when there's no end date or it's the same calendar day.
 */
export function formatEventDate(startIso: string, endIso?: string): string {
  const s = dateParts(startIso)
  if (!s) return ''
  const e = endIso ? dateParts(endIso) : null
  if (!e || (e.day === s.day && e.month === s.month && e.year === s.year)) return `${s.day} ${s.month} ${s.year}`
  if (e.month === s.month && e.year === s.year) return `${s.day}–${e.day} ${s.month} ${s.year}`
  if (e.year === s.year) return `${s.day} ${s.month} – ${e.day} ${e.month} ${e.year}`
  return `${s.day} ${s.month} ${s.year} – ${e.day} ${e.month} ${e.year}`
}
