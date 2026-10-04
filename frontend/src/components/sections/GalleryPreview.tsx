import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { AsyncList } from '@/components/shared/AsyncList'
import { Reveal } from '@/components/shared/Reveal'
import { useApi } from '@/hooks/useApi'
import { getGallery } from '@/lib/api/resources'

import { resolveMediaUrl } from '@/lib/media'

export function GalleryPreview() {
  const state = useApi(() => getGallery({ limit: 2 }), [])

  return (
    <Section>
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              Moments
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-text sm:text-4xl">From our church</h2>
          </div>
          <Button to="/gallery" variant="link">
            View gallery &rarr;
          </Button>
        </div>
      </Reveal>

      <AsyncList
        state={state}
        loadingLabel="Loading photos..."
        emptyTitle="Photos coming soon"
        emptyDescription="Photos will appear here once they're added from the admin dashboard."
        errorTitle="Unable to load photos"
      >
        {(photos) => (
          <div className="grid gap-4 sm:grid-cols-2">
            {photos.map((photo, index) => (
              <Reveal key={photo.id} delay={index * 100}>
                <div className="aspect-[4/3] overflow-hidden rounded-lg">
                  <img
                    src={resolveMediaUrl(photo.imageUrl)}
                    alt={photo.altText}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </AsyncList>
    </Section>
  )
}
