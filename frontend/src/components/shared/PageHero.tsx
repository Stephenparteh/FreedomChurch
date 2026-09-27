import type { ReactNode } from 'react'
import { Section } from '@/components/ui/Section'

interface PageHeroProps {
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
}

/** Consistent header block for interior (non-homepage) pages. */
export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <Section tone="muted" className="py-14 sm:py-16">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
          {title}
        </h1>
        {description && <p className="mt-4 text-lg text-text-muted">{description}</p>}
        {children}
      </div>
    </Section>
  )
}
