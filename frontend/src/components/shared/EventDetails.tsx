import type { ChurchEvent } from '@/types/content'

/** Time, place, category, and RSVP link for one event. Renders only what the church has entered. */
export function EventDetails({ event }: { event: ChurchEvent }) {
  const time = event.startTime ? `${event.startTime}${event.endTime ? `–${event.endTime}` : ''}` : ''
  const lines = [time, event.location].filter(Boolean)
  return (
    <>
      {event.category && (
        <span className="mt-3 inline-block rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
          {event.category}
        </span>
      )}
      {lines.length > 0 && <p className="mt-2 text-sm text-text-muted">{lines.join(' · ')}</p>}
      {event.rsvpUrl && (
        <a href={event.rsvpUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-primary-600 underline">
          RSVP
        </a>
      )}
    </>
  )
}
