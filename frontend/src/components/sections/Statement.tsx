/**
 * A full-width typographic statement that breaks up the photography. Words are
 * the church's own brand themes. Their wording is design copy that needs church
 * approval before launch (see docs/MISSING_CONTENT.md).
 */
export function Statement() {
  return (
    <section aria-label="Church themes" className="bg-surface-warm py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="font-display text-4xl font-medium leading-[1.15] tracking-tight text-primary-900 sm:text-6xl lg:text-7xl">
          Freedom. Faith. Worship.{' '}
          <span className="text-accent-500">Community.</span>
        </p>
      </div>
    </section>
  )
}
