import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { useApi } from '@/hooks/useApi'
import { getGallery } from '@/lib/api/resources'
import { resolveMediaUrl } from '@/lib/media'

/** Three moments in an offset, editorial arrangement. Hidden until photos are published. */
export function GalleryPreview() {
  const state = useApi(() => getGallery({ limit: 3 }), [])
  if (state.status !== 'success' || state.data.length === 0) return null
  const [first, second, third] = state.data

  return (
    <section className="bg-surface py-20 sm:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Moments</p>
            <h2 className="display-lg mt-4 text-text">From our church family</h2>
          </div>
          <Button to="/gallery" variant="link" className="text-base">
            View the gallery &rarr;
          </Button>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-12 md:grid-rows-2">
          <Tile photo={first} className="md:col-span-7 md:row-span-2 aspect-[4/3] md:aspect-auto md:h-full" />
          {second && <Tile photo={second} className="aspect-[4/3] md:col-span-5" />}
          {third && <Tile photo={third} className="aspect-[4/3] md:col-span-5" />}
        </div>
      </Container>
    </section>
  )
}

function Tile({
  photo,
  className,
}: {
  photo: { id: string; imageUrl: string; altText: string }
  className?: string
}) {
  return (
    <figure className={`group overflow-hidden rounded-lg bg-primary-50 ${className ?? ''}`}>
      <img
        src={resolveMediaUrl(photo.imageUrl)}
        alt={photo.altText}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        loading="lazy"
      />
    </figure>
  )
}
