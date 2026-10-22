import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { AsyncList } from "@/components/shared/AsyncList";
import { EventDetails } from "@/components/shared/EventDetails";
import { ImageLightbox } from "@/components/shared/ImageLightbox";
import { Reveal } from "@/components/shared/Reveal";
import { StateMessage } from "@/components/shared/StateMessage";
import { useApi } from "@/hooks/useApi";
import { getEvents } from "@/lib/api/resources";
import { dateParts, effectiveEventEnd, formatEventDate } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";
import type { ChurchEvent } from "@/types/content";

/**
 * NFPC Events
 *
 * Page structure:
 * 1. Featured / next upcoming event
 * 2. Remaining upcoming events
 * 3. Optional past events archive
 *
 * The closest upcoming event automatically becomes the featured event.
 * A future CMS "featured" flag can replace this logic without changing
 * the visual structure.
 *
 * Multi-day events (optional `endDate`) are supported throughout: an event
 * counts as "upcoming" until its end date has passed, not its start date,
 * and every date display shows a range when start and end differ.
 */
export function EventsList() {
  const state = useApi(() => getEvents({ limit: 100 }), []);

  // Keep the upcoming/past split stable during a single visit.
  const [now] = useState(() => Date.now());

  // One lightbox for the whole page — whichever flyer (featured or card) was clicked.
  const [lightboxEvent, setLightboxEvent] = useState<ChurchEvent | null>(null);
  const lightboxImage = lightboxEvent ? resolveMediaUrl(lightboxEvent.image) : null;

  return (
    <>
    <AsyncList
      state={state}
      loadingLabel="Loading events..."
      emptyTitle="No events scheduled yet"
      emptyDescription="Upcoming events will appear here once they are published."
      errorTitle="Unable to load events"
      className="mt-0"
    >
      {(events) => {
        const upcoming = events
          .filter((event) => effectiveEventEnd(event) >= now)
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          );

        const past = events
          .filter((event) => effectiveEventEnd(event) < now)
          .sort(
            (a, b) => effectiveEventEnd(b) - effectiveEventEnd(a),
          );

        const [featured, ...remaining] = upcoming;

        return (
          <>
            {/* Featured / next event */}
            <section className="bg-surface py-20 sm:py-28 lg:py-22">
              <Container>
                {featured ? (
                  <Reveal>
                    <FeaturedEvent event={featured} onOpenImage={setLightboxEvent} />
                  </Reveal>
                ) : (
                  <StateMessage
                    title="No upcoming events"
                    description="Check back soon for what comes next."
                  />
                )}
              </Container>
            </section>

            {/* Remaining upcoming events */}
            {remaining.length > 0 && (
              <section className="bg-surface-muted py-20 sm:py-28 lg:py-22">
                <Container>
                  <Reveal className="max-w-3xl">
                    <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-500">
                      <span
                        aria-hidden="true"
                        className="h-px w-8 bg-accent-500"
                      />
                      What&apos;s coming up
                    </p>

                    <h2 className="mt-5 font-display text-4xl font-semibold leading-[1] tracking-tight text-primary-900 sm:text-5xl lg:text-6xl">
                      More events.
                    </h2>
                  </Reveal>

                  <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                    {remaining.map((event, index) => (
                      <Reveal key={event.id} delay={Math.min(index, 4) * 80}>
                        <EventCard event={event} onOpenImage={setLightboxEvent} />
                      </Reveal>
                    ))}
                  </div>
                </Container>
              </section>
            )}

            {/* Past events */}
            {past.length > 0 && (
              <section className="bg-surface py-20 sm:py-24">
                <Container>
                  <Reveal>
                    <div className="max-w-3xl">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
                        Looking back
                      </p>

                      <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-primary-900 sm:text-4xl">
                        Past events
                      </h2>
                    </div>

                    <div className="mt-8 border-t border-border">
                      {past.map((event) => (
                        <div
                          key={event.id}
                          className="flex flex-col gap-2 border-b border-border py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                        >
                          <p className="font-display text-xl font-semibold text-primary-900">
                            {event.title}
                          </p>

                          <p className="text-sm text-text-muted">
                            {formatEventDate(event.date, event.endDate)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Reveal>
                </Container>
              </section>
            )}
          </>
        );
      }}
    </AsyncList>

    {lightboxEvent && lightboxImage && (
      <ImageLightbox src={lightboxImage} alt={lightboxEvent.title} onClose={() => setLightboxEvent(null)} />
    )}
    </>
  );
}

function FeaturedEvent({ event, onOpenImage }: { event: ChurchEvent; onOpenImage: (event: ChurchEvent) => void }) {
  const image = resolveMediaUrl(event.image);
  const parts = dateParts(event.date);
  const endParts = event.endDate ? dateParts(event.endDate) : null;
  const isMultiDay = Boolean(
    parts && endParts && (endParts.day !== parts.day || endParts.month !== parts.month || endParts.year !== parts.year),
  );

  return (
    <article className="grid overflow-hidden rounded-md bg-primary-900 lg:grid-cols-12">
      {/* Event flyer */}
      <div className="bg-white lg:col-span-7">
        <div className="flex aspect-[4/3] items-center justify-center lg:aspect-auto lg:h-full">
          {image ? (
            <button
              type="button"
              onClick={() => onOpenImage(event)}
              aria-label={`View flyer for ${event.title}`}
              className="flex h-full w-full items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              <img
                src={image}
                alt=""
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </button>
          ) : (
            <div className="flex h-full min-h-[360px] w-full items-center justify-center bg-primary-900 px-10 text-center">
              <span className="font-display text-6xl font-semibold leading-none text-white/15 sm:text-8xl">
                {event.title}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Event information */}
      <div className="flex flex-col justify-center p-8 text-white sm:p-10 lg:col-span-5 lg:p-14 xl:p-16">
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-500">
          <span aria-hidden="true" className="h-px w-8 bg-accent-500" />
          Next event
        </p>

        <div className="mt-8 flex items-end gap-4">
          <span className="font-display text-7xl font-semibold leading-[0.8] sm:text-8xl">
            {parts?.day}
          </span>

          <div className="pb-1">
            <p className="font-display text-2xl font-semibold uppercase text-accent-500 sm:text-3xl">
              {parts?.month}
            </p>

            <p className="mt-1 text-sm text-white/55">
              {isMultiDay ? `Through ${endParts?.day} ${endParts?.month} ${endParts?.year}` : `${parts?.weekday} · ${parts?.year}`}
            </p>
          </div>
        </div>

        <h2 className="mt-8 font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl">
          {event.title}
        </h2>

        {event.description && (
          <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">
            {event.description}
          </p>
        )}

        <div className="mt-7">
          <EventDetails event={event} dark />
        </div>
      </div>
    </article>
  );
}

function EventCard({ event, onOpenImage }: { event: ChurchEvent; onOpenImage: (event: ChurchEvent) => void }) {
  const image = resolveMediaUrl(event.image);
  const [expanded, setExpanded] = useState(false);
  // A rough length check: only offer "Read more" when there's actually more to read.
  const isLong = (event.description?.length ?? 0) > 140;

  return (
    <article className="group">
      <div className="overflow-hidden rounded-md bg-white">
        <div className="aspect-[4/3]">
          {image ? (
            <button
              type="button"
              onClick={() => onOpenImage(event)}
              aria-label={`View flyer for ${event.title}`}
              className="block h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              <img
                src={image}
                alt=""
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </button>
          ) : (
            <div className="flex h-full items-center justify-center bg-primary-900 px-8 text-center">
              <span className="font-display text-3xl font-semibold leading-tight text-white/15">
                {event.title}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-500">
          {formatEventDate(event.date, event.endDate)}
        </p>

        <h3 className="mt-2 font-display text-2xl font-semibold leading-[1.08] tracking-tight text-primary-900 sm:text-3xl">
          {event.title}
        </h3>

        {event.description && (
          <>
            <p className={expanded ? "mt-3 text-sm leading-relaxed text-text-muted" : "mt-3 line-clamp-4 text-sm leading-relaxed text-text-muted"}>
              {event.description}
            </p>
            {isLong && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-2 rounded text-sm font-semibold text-primary-700 underline-offset-4 hover:text-accent-500 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </>
        )}

        <div className="mt-4">
          <EventDetails event={event} />
        </div>
      </div>
    </article>
  );
}
