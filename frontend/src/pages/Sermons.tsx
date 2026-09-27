import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/shared/PageHero'
import { placeholderSermons } from '@/data/placeholders'
import { usePageMeta } from '@/hooks/usePageMeta'

export function Sermons() {
  usePageMeta('Sermons', 'Watch and listen to sermons from NFPC.')

  return (
    <>
      <PageHero
        eyebrow="Sermon library"
        title="Sermons"
        description="Browse recent teachings. This library will be searchable and filterable once it's backed by the admin dashboard (Milestone 4) and API (Milestone 3)."
      />

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeholderSermons.map((sermon) => (
            <Card key={sermon.id}>
              <div className="aspect-video rounded-md bg-surface-muted" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold text-text">{sermon.title}</h3>
              <p className="mt-1 text-sm text-text-muted">
                {sermon.preacher} &middot; {sermon.date}
              </p>
              <p className="mt-3 text-sm text-text-muted">{sermon.description}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}
