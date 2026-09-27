import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/shared/Reveal'
import { StateMessage } from '@/components/shared/StateMessage'
import { placeholderEvents } from '@/data/placeholders'

export function EventsPreview() {
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

      {placeholderEvents.length === 0 ? (
        <StateMessage
          className="mt-10"
          title="No upcoming events"
          description="Check back soon, or view our full events calendar."
        />
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {placeholderEvents.map((event, index) => (
            <Reveal key={event.id} delay={index * 100}>
              <Card interactive className="h-full">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                  {event.date}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-text">{event.title}</h3>
                <p className="mt-3 text-sm text-text-muted">{event.description}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  )
}
