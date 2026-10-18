import { dateParts } from '@/lib/format'
import { cn } from '@/lib/cn'

/** A compact calendar-style date for editorial lists. Renders nothing for an invalid date. */
export function DateBlock({ iso, className }: { iso: string; className?: string }) {
  const parts = dateParts(iso)
  if (!parts) return null
  return (
    <div
      className={cn(
        'flex w-20 shrink-0 flex-col items-center rounded-md border border-primary-100 bg-primary-50 py-3 text-center',
        className,
      )}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-700">{parts.month}</span>
      <span className="font-display text-3xl font-semibold leading-none text-text">{parts.day}</span>
      <span className="mt-1 text-[0.65rem] text-text-muted">{parts.year}</span>
    </div>
  )
}
