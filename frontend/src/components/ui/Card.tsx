import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Adds a subtle lift on hover, for cards that represent a link or clickable item. */
  interactive?: boolean
}

/** A quiet surface for grouping content. Prefer layout and typography over boxes. */
export function Card({ className, children, interactive, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'panel p-6 transition-[box-shadow,transform,border-color] duration-300',
        interactive && 'hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-elevated',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
