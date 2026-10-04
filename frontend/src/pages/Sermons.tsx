import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { AsyncList } from '@/components/shared/AsyncList'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { StateMessage } from '@/components/shared/StateMessage'
import { useApi } from '@/hooks/useApi'
import { usePageMeta } from '@/hooks/usePageMeta'
import { getSermons } from '@/lib/api/resources'
import { cn } from '@/lib/cn'

import { resolveMediaUrl } from '@/lib/media'

export function Sermons() {
  usePageMeta('Sermons', 'Watch and listen to sermons from NFPC.')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  // Category filtering is server-side (the API supports it); free-text
  // search is client-side over the fetched page — full-text search isn't
  // part of the Milestone 3 API (see docs/BACKEND_PLAN.md).
  const state = useApi(() => getSermons({ limit: 100, category: category ?? undefined }), [category])

  const categories = useMemo(() => {
    if (state.status !== 'success') return []
    return Array.from(new Set(state.data.map((s) => s.category).filter(Boolean))) as string[]
  }, [state])

  return (
    <>
      <PageHero
        eyebrow="Sermon library"
        title="Sermons"
        description="Browse recent teachings."
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

        <AsyncList
          state={state}
          loadingLabel="Loading sermons..."
          emptyTitle="No sermons available yet"
          emptyDescription="Sermons will appear here once they're added from the admin dashboard."
          errorTitle="Unable to load sermons"
        >
          {(sermons) => {
            const filtered = sermons.filter(
              (sermon) =>
                query.trim() === '' ||
                sermon.title.toLowerCase().includes(query.toLowerCase()) ||
                sermon.speaker.toLowerCase().includes(query.toLowerCase()),
            )

            if (filtered.length === 0) {
              return (
                <StateMessage
                  className="mt-10"
                  title="No sermons match your search"
                  description="Try a different keyword or clear the category filter."
                />
              )
            }

            return (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((sermon, index) => (
                  <Reveal key={sermon.id} delay={(index % 3) * 100}>
                    <Card interactive className="flex h-full flex-col">
                      {resolveMediaUrl(sermon.thumbnail) ? (
                        <img src={resolveMediaUrl(sermon.thumbnail)} alt="" className="aspect-video w-full rounded-md object-cover" />
                      ) : (
                        <div className="aspect-video rounded-md bg-surface-muted" aria-hidden />
                      )}
                      {sermon.category && (
                        <span className="mt-4 w-fit rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
                          {sermon.category}
                        </span>
                      )}
                      <h3 className="mt-3 text-lg font-semibold text-text">{sermon.title}</h3>
                      <p className="mt-1 text-sm text-text-muted">
                        {sermon.speaker} &middot;{' '}
                        {new Date(sermon.date).toLocaleDateString(undefined, {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="mt-3 flex-1 text-sm text-text-muted">{sermon.description}</p>
                    </Card>
                  </Reveal>
                ))}
              </div>
            )
          }}
        </AsyncList>
      </Section>
    </>
  )
}
