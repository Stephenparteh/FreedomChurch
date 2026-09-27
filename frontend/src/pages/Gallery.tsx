import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { StateMessage } from '@/components/shared/StateMessage'
import { galleryPhotos } from '@/data/gallery'
import { usePageMeta } from '@/hooks/usePageMeta'

export function Gallery() {
  usePageMeta('Gallery', 'Photos from services and events at NFPC.')

  return (
    <>
      <PageHero
        eyebrow="Moments"
        title="Gallery"
        description="Photos from services and church life. This page did not exist on the legacy site despite being linked from its navigation — see docs/LEGACY_AUDIT.md."
      />

      <Section>
        <div className="grid gap-4 sm:grid-cols-2">
          {galleryPhotos.map((photo) => (
            <Reveal key={photo.id}>
              <a
                href={photo.fullUrl}
                target="_blank"
                rel="noreferrer"
                className="group block overflow-hidden rounded-lg"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption ?? ''}
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

        <StateMessage
          className="mt-10"
          title="More photos coming soon"
          description="This is currently the full extent of verified NFPC photography recovered from the legacy site. Additional photos will be added here once church administrators can upload them directly (Milestone 4)."
        />
      </Section>
    </>
  )
}
