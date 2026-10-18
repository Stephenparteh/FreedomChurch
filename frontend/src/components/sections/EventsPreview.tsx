import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useApi } from "@/hooks/useApi";
import { getEvents } from "@/lib/api/resources";
import { resolveMediaUrl } from "@/lib/media";
import { Link } from "react-router-dom";

/**
 * Events preview:
 * Pure flyer-first event grid.
 *
 * Each event is represented only by its flyer.
 * The entire flyer is clickable and opens the event detail page.
 */
export function EventsPreview() {
  const state = useApi(() => getEvents({ upcoming: true, limit: 6 }), []);

  if (state.status !== "success" || state.data.length === 0) return null;

  return (
    <section className="bg-surface-muted py-24 sm:py-32">
      <Container>
        {/* Section heading */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-500">
              <span aria-hidden="true" className="h-px w-8 bg-accent-500" />
              What&apos;s happening
            </p>

            <h2 className="display-md mt-5 text-primary-900">
              Upcoming events
            </h2>
          </div>

          <Button to="/events" variant="link">
            See the full calendar &rarr;
          </Button>
        </div>

        {/* Event flyer grid */}
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {state.data.slice(0, 6).map((event) => (
            <EventTile key={event.id} event={event} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function EventTile({
  event,
}: {
  event: {
    id: string;
    title: string;
    image?: string | null;
    thumbnail?: string | null;
  };
}) {
  const image = resolveMediaUrl(event.thumbnail || event.image);

  return (
    <Link
      to={`/events/${event.id}`}
      className="group block overflow-hidden rounded-sm bg-primary-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-4"
    >
      <div className="aspect-[4/5]">
        {image ? (
          <img
            src={image}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
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
    </Link>
  );
}
