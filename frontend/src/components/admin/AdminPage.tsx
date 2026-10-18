import type { ReactNode } from 'react'

/** Standard header for every admin screen: a clear title, a short purpose line, and optional actions. */
export function AdminPage({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
        <div className="min-w-0 max-w-2xl">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">{title}</h1>
          {description && <p className="mt-3 text-sm leading-relaxed text-text-muted">{description}</p>}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </header>
      {children}
    </div>
  )
}
