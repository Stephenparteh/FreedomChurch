import type { ChurchEvent } from '@/types/content'
import { cn } from '@/lib/cn'

/** Time, place, category, and RSVP link for one event. Renders only what the church has entered. */
export function EventDetails({ event, dark = false }: { event: ChurchEvent; dark?: boolean }) {
  const time = event.startTime ? `${event.startTime}${event.endTime ? `–${event.endTime}` : ''}` : ''
  const lines = [time, event.location].filter(Boolean)
  return (
    <div className="mt-3 space-y-2">
      {event.category && (
        <span
          className={cn(
            'inline-block rounded-full px-2.5 py-1 text-xs font-semibold',
            dark ? 'bg-white/10 text-gold-300' : 'bg-primary-50 text-primary-700',
          )}
        >
          {event.category}
        </span>
      )}
      {lines.length > 0 && (
        <p className={cn('text-sm', dark ? 'text-white/70' : 'text-text-muted')}>{lines.join(' · ')}</p>
      )}
      {event.rsvpUrl && (
        <a
          href={event.rsvpUrl}
          target="_blank"
          rel="noreferrer"
          className={cn(
            'inline-block text-sm font-semibold underline underline-offset-4',
            dark ? 'text-white hover:text-gold-300' : 'text-primary-700 hover:text-primary-900',
          )}
        >
          RSVP
        </a>
      )}
    </div>
  )
}
