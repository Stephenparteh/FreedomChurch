import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Adds a hover lift, for cards that represent a link/clickable item. */
  interactive?: boolean
}

export function Card({ className, children, interactive, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface p-6 shadow-soft transition-[box-shadow,transform] duration-300',
        interactive && 'hover:-translate-y-1 hover:shadow-elevated',
        !interactive && 'hover:shadow-elevated',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
