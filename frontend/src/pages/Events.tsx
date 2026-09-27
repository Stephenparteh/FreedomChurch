import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { StateMessage } from '@/components/shared/StateMessage'
import { placeholderEvents } from '@/data/placeholders'
import { usePageMeta } from '@/hooks/usePageMeta'

export function Events() {
  usePageMeta('Events', 'Upcoming events and services at NFPC.')

  return (
    <>
      <PageHero
        eyebrow="What's happening"
        title="Events"
        description="Upcoming services, studies, and gatherings. Filtering by category/date returns once events are managed from the admin dashboard."
      />

      <Section>
        <h2 className="text-2xl font-semibold text-text">Upcoming</h2>
        {placeholderEvents.length === 0 ? (
          <StateMessage
            className="mt-6"
            title="No upcoming events"
            description="Check back soon for what's next."
          />
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {placeholderEvents.map((event, index) => (
              <Reveal key={event.id} delay={(index % 3) * 100}>
                <Card interactive className="h-full">
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                    {event.date}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-text">{event.title}</h3>
                  {event.location && (
                    <p className="mt-1 text-sm text-text-muted">{event.location}</p>
                  )}
                  <p className="mt-3 text-sm text-text-muted">{event.description}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      <Section tone="muted">
        <h2 className="text-2xl font-semibold text-text">Past events</h2>
        <StateMessage
          className="mt-6"
          title="No past events on record yet"
          description="Once events are managed from the admin dashboard, a history of past gatherings will appear here."
        />
      </Section>
    </>
  )
}
