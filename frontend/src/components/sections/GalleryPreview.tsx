import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/shared/Reveal'
import { galleryPhotos } from '@/data/gallery'

export function GalleryPreview() {
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

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {galleryPhotos.map((photo, index) => (
          <Reveal key={photo.id} delay={index * 100}>
            <div className="aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={photo.imageUrl}
                alt={photo.caption ?? ''}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
