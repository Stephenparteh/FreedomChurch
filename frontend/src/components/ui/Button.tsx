import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'link' | 'light' | 'danger' | 'accent'

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary-600 text-white shadow-soft hover:bg-primary-700 active:bg-primary-800 focus-visible:outline-primary-600',
  accent: 'bg-accent-500 text-white shadow-soft hover:bg-accent-600 active:bg-accent-700 focus-visible:outline-accent-500',
  danger: 'bg-error text-white shadow-soft hover:bg-error/90 focus-visible:outline-error',
  secondary:
    'border border-border-strong bg-surface text-primary-700 hover:border-primary-300 hover:bg-primary-50 focus-visible:outline-primary-600',
  ghost: 'bg-transparent text-text hover:bg-surface-muted focus-visible:outline-primary-600',
  link: 'bg-transparent p-0 text-primary-600 hover:text-primary-800 focus-visible:outline-primary-600',
  light:
    'bg-white text-primary-800 shadow-soft hover:bg-primary-50 focus-visible:outline-white',
}

const baseClasses =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50'

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
