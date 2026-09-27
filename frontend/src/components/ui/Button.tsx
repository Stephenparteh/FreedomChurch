import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'link'

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 focus-visible:outline-primary-600 shadow-soft',
  secondary: 'bg-white text-primary-700 border border-border-strong hover:bg-primary-50',
  ghost: 'bg-transparent text-text hover:bg-surface-muted',
  link: 'bg-transparent text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline px-0 py-0',
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: Variant
  /** Renders as a <Link> (internal) or <a> (external) instead of a <button>. */
  to?: string
  external?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  to,
  external,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], className)

  if (to) {
    if (external) {
      return (
        <a href={to} className={classes} target="_blank" rel="noreferrer">
          {children}
        </a>
      )
    }
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
