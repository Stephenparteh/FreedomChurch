import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/shared/PageHero'
import { placeholderEvents } from '@/data/placeholders'
import { usePageMeta } from '@/hooks/usePageMeta'

export function Events() {
  usePageMeta('Events', 'Upcoming events and services at NFPC.')

  return (
    <>
      <PageHero
        eyebrow="What's happening"
        title="Events"
        description="Upcoming services, studies, and gatherings. Filtering by category/date will return once events are managed from the admin dashboard."
      />

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeholderEvents.map((event) => (
            <Card key={event.id}>
              <h3 className="text-lg font-semibold text-text">{event.title}</h3>
              <p className="mt-1 text-sm text-text-muted">{event.date}</p>
              <p className="mt-3 text-sm text-text-muted">{event.description}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}
