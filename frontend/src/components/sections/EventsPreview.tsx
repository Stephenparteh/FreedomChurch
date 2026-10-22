import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ImageLightbox } from "@/components/shared/ImageLightbox";
import { Reveal } from "@/components/shared/Reveal";
import { useApi } from "@/hooks/useApi";
import { getEvents } from "@/lib/api/resources";
import { resolveMediaUrl } from "@/lib/media";

type PreviewEvent = {
  id: string;
  title: string;
  image?: string | null;
  thumbnail?: string | null;
};

/**
 * Events preview:
 * Pure flyer-first event grid.
 *
 * Each event is represented only by its flyer. Clicking a flyer opens it in a
 * lightbox (there is no per-event detail page/route) instead of navigating
 * anywhere.
 */
export function EventsPreview() {
  const state = useApi(() => getEvents({ upcoming: true, limit: 6 }), []);
  const [lightboxEvent, setLightboxEvent] = useState<PreviewEvent | null>(null);

  if (state.status !== "success" || state.data.length === 0) return null;

  const lightboxImage = lightboxEvent ? resolveMediaUrl(lightboxEvent.image) : null;

  return (
    <section className="bg-surface-muted py-24 sm:py-32">
      <Container>
        {/* Section heading */}
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {/* <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-500">
              <span aria-hidden="true" className="h-px w-8 bg-accent-500" />
              What&apos;s happening
            </p> */}

            <h2 className="display-md mt-5 text-primary-900">
              Upcoming events
            </h2>
          </div>

          <Button to="/events" variant="link">
            See the full calendar &rarr;
          </Button>
        </Reveal>

        {/* Event flyer grid */}
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {state.data.slice(0, 6).map((event, index) => (
            <Reveal key={event.id} delay={index * 80}>
              <EventTile event={event} onOpen={setLightboxEvent} />
            </Reveal>
          ))}
        </div>
      </Container>

      {lightboxEvent && lightboxImage && (
        <ImageLightbox src={lightboxImage} alt={lightboxEvent.title} onClose={() => setLightboxEvent(null)} />
      )}
    </section>
  );
}

function EventTile({
  event,
  onOpen,
}: {
  event: PreviewEvent;
  onOpen: (event: PreviewEvent) => void;
}) {
  const image = resolveMediaUrl(event.thumbnail || event.image);

  return (
    <div className="overflow-hidden rounded-sm bg-primary-900">
      <div className="aspect-[4/5]">
        {image ? (
          <button
            type="button"
            onClick={() => onOpen(event)}
            aria-label={`View flyer for ${event.title}`}
            className="group block h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-4"
          >
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          </button>
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-primary-900 px-8 text-center"
            aria-label={event.title}
          >
            <span className="font-display text-3xl font-semibold text-white/20">
              {event.title}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
