import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";
import { useApi } from "@/hooks/useApi";
import { getSermons } from "@/lib/api/resources";
import { formatLongDate } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";
import type { Sermon } from "@/types/content";

/**
 * Sermons preview:
 * One featured message followed by three recent teachings.
 *
 * The featured message remains the primary visual focus.
 * Recent teachings use real sermon thumbnails instead of numbered markers.
 */
export function SermonsPreview() {
  const state = useApi(() => getSermons({ limit: 4 }), []);

  if (state.status !== "success" || state.data.length === 0) return null;

  const [featured, ...rest] = state.data;

  return (
    <section className="bg-surface py-24 sm:py-32">
      <Container>
        {/* Featured sermon */}
        <Reveal className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <FeaturedMedia sermon={featured} />

          <div className="lg:col-span-5">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-500">
              <span aria-hidden="true" className="h-px w-8 bg-accent-500" />
              Latest message
            </p>

            <h2 className="display-md mt-5 text-primary-900">
              {featured.title}
            </h2>

            <p className="mt-4 text-sm font-semibold text-text">
              {featured.speaker}{" "}
              <span className="font-normal text-text-muted">
                &middot; {formatLongDate(featured.date)}
              </span>
            </p>

            {featured.description && (
              <p className="mt-5 leading-relaxed text-text-muted">
                {featured.description}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {featured.videoUrl && (
                <Button to={featured.videoUrl} external variant="accent">
                  Watch
                </Button>
              )}

              {featured.audioUrl && (
                <Button to={featured.audioUrl} external variant="secondary">
                  Listen
                </Button>
              )}

              {!featured.videoUrl && !featured.audioUrl && (
                <Button to="/sermons" variant="secondary">
                  Open the library
                </Button>
              )}
            </div>
          </div>
        </Reveal>

        {/* Recent teachings */}
        {rest.length > 0 && (
          <div className="mt-24 border-t border-border pt-10">
            <Reveal className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">
                  Keep listening
                </p>

                <h3 className="mt-3 font-display text-3xl font-semibold leading-tight text-primary-900 sm:text-4xl">
                  Recent teaching
                </h3>
              </div>

              <Button to="/sermons" variant="link">
                Browse all sermons &rarr;
              </Button>
            </Reveal>

            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {rest.slice(0, 3).map((sermon, index) => (
                <Reveal key={sermon.id} delay={index * 80}>
                  <RecentItem sermon={sermon} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

function FeaturedMedia({ sermon }: { sermon: Sermon }) {
  const thumb = resolveMediaUrl(sermon.thumbnail);

  return (
    <div className="relative lg:col-span-7">
      <div className="aspect-[4/3] overflow-hidden rounded-sm bg-primary-900 lg:aspect-[5/4]">
        {thumb ? (
          <img
            src={thumb}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full items-center justify-center font-display text-[9rem] font-semibold leading-none text-white/10"
          >
            {sermon.title.charAt(0)}
          </div>
        )}
      </div>

      <div
        aria-hidden="true"
        className="absolute -bottom-6 -left-6 hidden h-24 w-24 bg-accent-500 sm:block"
      />
    </div>
  );
}

function RecentItem({ sermon }: { sermon: Sermon }) {
  const thumb = resolveMediaUrl(sermon.thumbnail);

  return (
    <article className="group">
      {/* Thumbnail */}
      <div className="aspect-[16/10] overflow-hidden rounded-sm bg-primary-900">
        {thumb ? (
          <img
            src={thumb}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full items-center justify-center font-display text-6xl font-semibold text-white/10"
          >
            {sermon.title.charAt(0)}
          </div>
        )}
      </div>

      {/* Information */}
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-700">
          {formatLongDate(sermon.date)}
        </p>

        <h4 className="mt-2 font-display text-2xl font-semibold leading-[1.1] text-primary-900">
          {sermon.title}
        </h4>

        <p className="mt-2 text-sm font-medium text-text-muted">
          {sermon.speaker}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-semibold">
          {sermon.videoUrl ? (
            <a
              href={sermon.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary-700 underline underline-offset-4 transition-colors hover:text-primary-900"
            >
              Watch sermon
            </a>
          ) : (
            <a
              href="/sermons"
              className="text-primary-700 underline underline-offset-4 transition-colors hover:text-primary-900"
            >
              View sermon library &rarr;
            </a>
          )}

          {sermon.audioUrl && (
            <a
              href={sermon.audioUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary-700 underline underline-offset-4 transition-colors hover:text-primary-900"
            >
              Listen to audio
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
