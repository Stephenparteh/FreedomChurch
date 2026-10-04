import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { AsyncList } from '@/components/shared/AsyncList'
import { Reveal } from '@/components/shared/Reveal'
import { EventDetails } from '@/components/shared/EventDetails'
import { useApi } from '@/hooks/useApi'
import { getEvents } from '@/lib/api/resources'

export function EventsPreview() {
  const state = useApi(() => getEvents({ upcoming: true, limit: 2 }), [])

  return (
    <Section tone="muted">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              What's happening
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-text sm:text-4xl">Upcoming events</h2>
          </div>
          <Button to="/events" variant="link">
            View all events &rarr;
          </Button>
        </div>
      </Reveal>

      <AsyncList
        state={state}
        loadingLabel="Loading events..."
        emptyTitle="No upcoming events"
        emptyDescription="Check back soon, or view our full events calendar."
        errorTitle="Unable to load events"
      >
        {(events) => (
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {events.map((event, index) => (
              <Reveal key={event.id} delay={index * 100}>
                <Card interactive className="h-full">
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                    {new Date(event.date).toLocaleDateString(undefined, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-text">{event.title}</h3>
                  <p className="mt-3 text-sm text-text-muted">{event.description}</p>
                <EventDetails event={event} />
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </AsyncList>
    </Section>
  )
}
