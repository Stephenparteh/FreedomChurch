import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { StateMessage } from '@/components/shared/StateMessage'
import { placeholderSermons } from '@/data/placeholders'
import { usePageMeta } from '@/hooks/usePageMeta'
import { cn } from '@/lib/cn'

export function Sermons() {
  usePageMeta('Sermons', 'Watch and listen to sermons from NFPC.')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  const categories = useMemo(
    () => Array.from(new Set(placeholderSermons.map((s) => s.category).filter(Boolean))) as string[],
    [],
  )

  const filtered = useMemo(() => {
    return placeholderSermons.filter((sermon) => {
      const matchesQuery =
        query.trim() === '' ||
        sermon.title.toLowerCase().includes(query.toLowerCase()) ||
        sermon.preacher.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = !category || sermon.category === category
      return matchesQuery && matchesCategory
    })
  }, [query, category])

  return (
    <>
      <PageHero
        eyebrow="Sermon library"
        title="Sermons"
        description="Browse recent teachings. This library will be backed by the admin dashboard (Milestone 4) and API (Milestone 3) — search and filtering here already work against real component state, ready to swap onto live data."
      />

      <Section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or preacher..."
            aria-label="Search sermons"
            className="w-full rounded-md border border-border-strong px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-primary-500 sm:max-w-sm"
          />
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategory(null)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                  category === null
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-border-strong text-text-muted hover:border-primary-300',
                )}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                    category === c
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-border-strong text-text-muted hover:border-primary-300',
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <StateMessage
            className="mt-10"
            title="No sermons match your search"
            description="Try a different keyword or clear the category filter."
          />
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((sermon, index) => (
              <Reveal key={sermon.id} delay={(index % 3) * 100}>
                <Card interactive className="flex h-full flex-col">
                  <div className="aspect-video rounded-md bg-surface-muted" aria-hidden />
                  {sermon.category && (
                    <span className="mt-4 w-fit rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
                      {sermon.category}
                    </span>
                  )}
                  <h3 className="mt-3 text-lg font-semibold text-text">{sermon.title}</h3>
                  <p className="mt-1 text-sm text-text-muted">
                    {sermon.preacher} &middot; {sermon.date}
                  </p>
                  <p className="mt-3 flex-1 text-sm text-text-muted">{sermon.description}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </Section>
    </>
  )
}
