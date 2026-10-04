import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { AsyncList } from '@/components/shared/AsyncList'
import { Reveal } from '@/components/shared/Reveal'
import { useApi } from '@/hooks/useApi'
import { getSermons } from '@/lib/api/resources'

import { resolveMediaUrl } from '@/lib/media'

export function SermonsPreview() {
  const state = useApi(() => getSermons({ limit: 3 }), [])

  return (
    <Section>
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              Sermon library
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-text sm:text-4xl">Recent sermons</h2>
          </div>
          <Button to="/sermons" variant="link">
            View all sermons &rarr;
          </Button>
        </div>
      </Reveal>

      <AsyncList
        state={state}
        loadingLabel="Loading sermons..."
        emptyTitle="No sermons available yet"
        emptyDescription="Sermons will appear here once they're added from the admin dashboard."
        errorTitle="Unable to load sermons"
      >
        {(sermons) => (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sermons.map((sermon, index) => (
              <Reveal key={sermon.id} delay={index * 100}>
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
                  <p className="mt-1 text-sm text-text-muted">{sermon.speaker}</p>
                  <p className="mt-3 flex-1 text-sm text-text-muted">{sermon.description}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </AsyncList>
    </Section>
  )
}
