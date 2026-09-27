import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Container } from './Container'

type Tone = 'default' | 'muted' | 'inverted'

const toneClasses: Record<Tone, string> = {
  default: 'bg-surface text-text',
  muted: 'bg-surface-muted text-text',
  inverted: 'bg-surface-inverted text-text-inverted',
}

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  tone?: Tone
  /** Set false for sections that manage their own width (e.g. full-bleed hero media). */
  contained?: boolean
}

export function Section({
  className,
  children,
  tone = 'default',
  contained = true,
  ...rest
}: SectionProps) {
  return (
    <section className={cn('py-16 sm:py-20', toneClasses[tone], className)} {...rest}>
      {contained ? <Container>{children}</Container> : children}
    </section>
  )
}
