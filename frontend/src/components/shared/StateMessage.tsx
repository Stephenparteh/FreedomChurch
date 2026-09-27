import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface StateMessageProps {
  title: string
  description?: string
  action?: ReactNode
  tone?: 'default' | 'error'
  className?: string
}

/** Reusable pattern for loading/empty/error states across list-driven pages. */
export function StateMessage({
  title,
  description,
  action,
  tone = 'default',
  className,
}: StateMessageProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : undefined}
      className={cn(
        'rounded-lg border border-dashed border-border-strong px-6 py-16 text-center',
        className,
      )}
    >
      <p className={cn('text-lg font-medium', tone === 'error' ? 'text-error' : 'text-text')}>
        {title}
      </p>
      {description && <p className="mt-2 text-sm text-text-muted">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}
