import { Section } from '@/components/ui/Section'
import { AsyncList } from '@/components/shared/AsyncList'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { useApi } from '@/hooks/useApi'
import { usePageMeta } from '@/hooks/usePageMeta'
import { getGallery } from '@/lib/api/resources'

import { resolveMediaUrl } from '@/lib/media'

export function Gallery() {
  usePageMeta('Gallery', 'Photos from services and events at NFPC.')
  const state = useApi(() => getGallery({ limit: 100 }), [])

  return (
    <>
      <PageHero
        eyebrow="Moments"
        title="Gallery"
        description="Photos from services and church life."
      />

      <Section>
        <AsyncList
          state={state}
          loadingLabel="Loading photos..."
          emptyTitle="No photos yet"
          emptyDescription="Photos will appear here once they're added from the admin dashboard."
          errorTitle="Unable to load the gallery"
        >
          {(photos) => (
            <div className="grid gap-4 sm:grid-cols-2">
              {photos.map((photo) => (
                <Reveal key={photo.id}>
                  <a
                    href={resolveMediaUrl(photo.imageUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="group block overflow-hidden rounded-lg"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={resolveMediaUrl(photo.imageUrl)}
                        alt={photo.altText}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    {photo.caption && (
                      <p className="mt-2 text-sm text-text-muted">{photo.caption}</p>
                    )}
                  </a>
                </Reveal>
              ))}
            </div>
          )}
        </AsyncList>
      </Section>
    </>
  )
}
