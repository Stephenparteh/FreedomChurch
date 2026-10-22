import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";
import { StateMessage } from "@/components/shared/StateMessage";
import { useApi } from "@/hooks/useApi";
import { getGallery } from "@/lib/api/resources";
import { resolveMediaUrl } from "@/lib/media";

/*
 * Reconnected to the real Gallery API/CRUD (getGallery()). Visual layout, tabs, and
 * masonry behavior are unchanged from the design-preview version.
 *
 * The "Videos" tab is kept in place (removing it would be a design change), but the
 * backend's GalleryItem model has no video/media-type field — every real record is a
 * photo. Until that field exists, "Videos" will always show the empty state below
 * rather than a fabricated video. This is a genuine backend gap, not a bug here.
 */

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Photos", value: "photo" },
  { label: "Videos", value: "video" },
] as const;

type Filter = (typeof FILTERS)[number]["value"];

export function GalleryList() {
  const [filter, setFilter] = useState<Filter>("all");
  const state = useApi(() => getGallery({ limit: 100 }), []);

  const items = state.status === "success" ? state.data : [];
  // Every real record is a photo — see the note above on the "Videos" tab.
  const filteredMedia = filter === "video" ? [] : items;

  return (
    <section className="bg-surface py-16 sm:py-20 lg:py-14">
      <Container>
        {/* Gallery header / media controls */}
        <div className="py-5 sm:py-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-2xl font-semibold tracking-tight text-primary-900 sm:text-3xl">
                Live at NFPC
              </p>
            </div>

            <div className="flex items-center gap-6">
              {FILTERS.map((item) => {
                const active = filter === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilter(item.value)}
                    className={`relative pb-2 text-sm font-semibold transition-colors ${
                      active
                        ? "text-primary-900"
                        : "text-text-muted hover:text-primary-900"
                    }`}
                  >
                    {item.label}

                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-0.5 bg-accent-500"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {state.status === "loading" && <StateMessage title="Loading photos..." />}
        {state.status === "error" && (
          <StateMessage tone="error" title="Unable to load the gallery" description={state.error.message} />
        )}
        {state.status === "success" && filteredMedia.length === 0 && (
          <StateMessage
            title={filter === "video" ? "No videos yet" : "No photos yet"}
            description="Photos from services and church life will appear here once they're added."
          />
        )}

        {/*
         * Masonry gallery
         *
         * No fixed aspect ratios are applied.
         * Each uploaded image keeps its natural dimensions.
         *
         * Portrait stays portrait.
         * Landscape stays landscape.
         * Square stays square.
         *
         * Future portrait and landscape videos can use the same layout.
         */}
        {filteredMedia.length > 0 && (
          <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {filteredMedia.map((media, index) => (
              <Reveal key={media.id} className="mb-4 break-inside-avoid" delay={(index % 6) * 60}>
                <article className="group overflow-hidden rounded-md bg-primary-50">
                  <div className="relative overflow-hidden">
                    <img
                      src={resolveMediaUrl(media.imageUrl)}
                      alt={media.altText}
                      className="block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
