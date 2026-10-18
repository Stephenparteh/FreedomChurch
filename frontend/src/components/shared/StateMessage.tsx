import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface StateMessageProps {
  title: string
  description?: string
  action?: ReactNode
  tone?: 'default' | 'error'
  className?: string
}

/** Quiet loading, empty, and error state. Centered, no heavy border, so it reads as intentional. */
export function StateMessage({ title, description, action, tone = 'default', className }: StateMessageProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn('mx-auto max-w-lg px-6 py-14 text-center', className)}
    >
      <p
        className={cn(
          'font-display text-xl font-semibold',
          tone === 'error' ? 'text-error' : 'text-text',
        )}
      >
        {title}
      </p>
      {description && <p className="mt-3 text-sm leading-relaxed text-text-muted">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}
