import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { AsyncList } from "@/components/shared/AsyncList";
import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import { StateMessage } from "@/components/shared/StateMessage";
import { useApi } from "@/hooks/useApi";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getSermons } from "@/lib/api/resources";
import { cn } from "@/lib/cn";
import { formatLongDate } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";
import type { Sermon } from "@/types/content";

export function Sermons() {
  usePageMeta("Sermons", "Watch and listen to sermons from NFPC.");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  // Category filtering is server-side (the API supports it); free-text
  // search is client-side over the fetched page, since full-text search is
  // not part of the API (see docs/BACKEND_PLAN.md).
  const state = useApi(
    () => getSermons({ limit: 100, category: category ?? undefined }),
    [category],
  );

  const categories = useMemo(() => {
    if (state.status !== "success") return [];
    return Array.from(
      new Set(state.data.map((s) => s.category).filter(Boolean)),
    ) as string[];
  }, [state]);

  return (
    <>
      <PageHero
        title="Sermons"
        description="Listen to recent teaching, and return to the messages that speak to you."
      />

      <section className="py-14 sm:py-20">
        <Container>
          <div className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-center sm:justify-between">
            <label className="w-full sm:max-w-sm">
              <span className="sr-only">Search sermons</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title or preacher"
                className="field-input mt-0"
              />
            </label>
            {categories.length > 0 && (
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Filter by category"
              >
                <FilterChip
                  active={category === null}
                  onClick={() => setCategory(null)}
                >
                  All
                </FilterChip>
                {categories.map((c) => (
                  <FilterChip
                    key={c}
                    active={category === c}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </FilterChip>
                ))}
              </div>
            )}
          </div>

          <div className="mt-10">
            <AsyncList
              state={state}
              loadingLabel="Loading sermons..."
              emptyTitle="Sermons are being prepared"
              emptyDescription="Recent teaching will appear here once it is published."
              errorTitle="Unable to load sermons"
              className="mt-0"
            >
              {(sermons) => {
                const q = query.trim().toLowerCase();
                const filtered = sermons.filter(
                  (sermon) =>
                    q === "" ||
                    sermon.title.toLowerCase().includes(q) ||
                    sermon.speaker.toLowerCase().includes(q),
                );

                if (filtered.length === 0) {
                  return (
                    <StateMessage
                      title="No sermons match your search"
                      description="Try a different keyword, or choose another category."
                    />
                  );
                }

                // The newest sermon leads the page when no search or filter narrows the list.
                const showFeatured =
                  q === "" && category === null && filtered.length > 1;
                const featured = showFeatured ? filtered[0] : undefined;
                const rest = showFeatured ? filtered.slice(1) : filtered;

                return (
                  <>
                    {featured && (
                      <Reveal>
                        <FeaturedSermon sermon={featured} />
                      </Reveal>
                    )}
                    <ul
                      className={
                        featured
                          ? "mt-16 divide-y divide-border"
                          : "divide-y divide-border"
                      }
                    >
                      {rest.map((sermon, index) => (
                        <Reveal
                          key={sermon.id}
                          as="li"
                          delay={Math.min(index, 4) * 80}
                        >
                          <SermonRow sermon={sermon} />
                        </Reveal>
                      ))}
                    </ul>
                  </>
                );
              }}
            </AsyncList>
          </div>
        </Container>
      </section>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-10 rounded-full border px-4 text-sm font-medium transition-colors",
        active
          ? "border-primary-700 bg-primary-700 text-white"
          : "border-border-strong text-text-muted hover:border-primary-300 hover:text-text",
      )}
    >
      {children}
    </button>
  );
}

function FeaturedSermon({ sermon }: { sermon: Sermon }) {
  const thumb = resolveMediaUrl(sermon.thumbnail);
  return (
    <article className="grid gap-10 lg:grid-cols-12 lg:items-center">
      <div className="aspect-video overflow-hidden rounded-xl bg-primary-900 lg:col-span-7">
        {thumb ? (
          <img
            src={thumb}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-full items-center justify-center font-display text-7xl text-white/20"
          >
            {sermon.title.charAt(0)}
          </div>
        )}
      </div>
      <div className="lg:col-span-5">
        <p className="eyebrow">Latest message</p>
        <h2 className="display-md mt-4 text-text">{sermon.title}</h2>
        <p className="mt-4 text-sm font-semibold text-primary-700">
          {sermon.speaker} &middot; {formatLongDate(sermon.date)}
        </p>
        {sermon.description && (
          <p className="mt-5 leading-relaxed text-text-muted">
            {sermon.description}
          </p>
        )}
        {(sermon.videoUrl || sermon.audioUrl) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {sermon.videoUrl && (
              <Button to={sermon.videoUrl} external>
                Watch
              </Button>
            )}
            {sermon.audioUrl && (
              <Button to={sermon.audioUrl} external variant="secondary">
                Listen
              </Button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function SermonRow({ sermon }: { sermon: Sermon }) {
  const thumb = resolveMediaUrl(sermon.thumbnail);
  return (
    <div className="grid gap-5 py-8 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-8">
      <div className="aspect-video overflow-hidden rounded-lg bg-primary-900 sm:aspect-[4/3]">
        {thumb ? (
          <img
            src={thumb}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-full items-center justify-center font-display text-5xl text-white/20"
          >
            {sermon.title.charAt(0)}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-700">
          {[sermon.category, formatLongDate(sermon.date)]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold leading-snug text-text">
          {sermon.title}
        </h2>
        <p className="mt-1 text-sm font-medium text-text">{sermon.speaker}</p>
        {sermon.description && (
          <p className="mt-3 line-clamp-2 text-text-muted">
            {sermon.description}
          </p>
        )}
        {(sermon.videoUrl || sermon.audioUrl) && (
          <ul className="mt-4 flex flex-wrap gap-5 text-sm font-semibold">
            {sermon.videoUrl && (
              <li>
                <a
                  href={sermon.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-700 underline underline-offset-4 hover:text-primary-900"
                >
                  Watch
                </a>
              </li>
            )}
            {sermon.audioUrl && (
              <li>
                <a
                  href={sermon.audioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-700 underline underline-offset-4 hover:text-primary-900"
                >
                  Listen
                </a>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
