import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/shared/PageHero'
import { placeholderGallery } from '@/data/placeholders'
import { usePageMeta } from '@/hooks/usePageMeta'

export function Gallery() {
  usePageMeta('Gallery', 'Photos from services and events at NFPC.')

  return (
    <>
      <PageHero
        eyebrow="Moments"
        title="Gallery"
        description="Photos from services, events, and community life. This page did not exist on the legacy site despite being linked from its navigation — see docs/LEGACY_AUDIT.md."
      />

      <Section>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {placeholderGallery.map((item) => (
            <div key={item.id} className="aspect-square rounded-md bg-surface-muted" aria-hidden />
          ))}
        </div>
      </Section>
    </>
  )
}
