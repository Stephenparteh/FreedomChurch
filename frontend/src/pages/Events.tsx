import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { AsyncList } from '@/components/shared/AsyncList'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { StateMessage } from '@/components/shared/StateMessage'
import { EventDetails } from '@/components/shared/EventDetails'
import { useApi } from '@/hooks/useApi'
import { usePageMeta } from '@/hooks/usePageMeta'
import { getEvents } from '@/lib/api/resources'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function Events() {
  usePageMeta('Events', 'Upcoming events and services at NFPC.')
  const state = useApi(() => getEvents({ limit: 100 }), [])
  // Computed once per mount rather than at render time, so the
  // upcoming/past split stays stable across re-renders within a visit.
  const [now] = useState(() => Date.now())

  return (
    <>
      <PageHero
        eyebrow="What's happening"
        title="Events"
        description="Upcoming services, studies, and gatherings."
      />

      <AsyncList
        state={state}
        loadingLabel="Loading events..."
        emptyTitle="No events yet"
        emptyDescription="Events will appear here once they're added from the admin dashboard."
        errorTitle="Unable to load events"
        className="mt-6 px-4 sm:px-6 lg:px-8"
      >
        {(events) => {
          const upcoming = events.filter((e) => new Date(e.date).getTime() >= now)
          const past = events.filter((e) => new Date(e.date).getTime() < now)

          return (
            <>
              <Section>
                <h2 className="text-2xl font-semibold text-text">Upcoming</h2>
                {upcoming.length === 0 ? (
                  <StateMessage
                    className="mt-6"
                    title="No upcoming events"
                    description="Check back soon for what's next."
                  />
                ) : (
                  <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {upcoming.map((event, index) => (
                      <Reveal key={event.id} delay={(index % 3) * 100}>
                        <Card interactive className="h-full">
                          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                            {formatDate(event.date)}
                          </p>
                          <h3 className="mt-2 text-lg font-semibold text-text">{event.title}</h3>
                          {event.location && (
                            <p className="mt-1 text-sm text-text-muted">{event.location}</p>
                          )}
                          <p className="mt-3 text-sm text-text-muted">{event.description}</p>
                          <EventDetails event={event} />
                        </Card>
                      </Reveal>
                    ))}
                  </div>
                )}
              </Section>

              <Section tone="muted">
                <h2 className="text-2xl font-semibold text-text">Past events</h2>
                {past.length === 0 ? (
                  <StateMessage
                    className="mt-6"
                    title="No past events on record yet"
                    description="A history of past gatherings will appear here as events are added."
                  />
                ) : (
                  <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {past.map((event, index) => (
                      <Reveal key={event.id} delay={(index % 3) * 100}>
                        <Card className="h-full">
                          <p className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                            {formatDate(event.date)}
                          </p>
                          <h3 className="mt-2 text-lg font-semibold text-text">{event.title}</h3>
                          <p className="mt-3 text-sm text-text-muted">{event.description}</p>
                          <EventDetails event={event} />
                        </Card>
                      </Reveal>
                    ))}
                  </div>
                )}
              </Section>
            </>
          )
        }}
      </AsyncList>
    </>
  )
}
