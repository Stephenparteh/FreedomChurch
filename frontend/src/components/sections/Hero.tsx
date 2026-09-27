import congregationPhoto from '@/assets/photos/congregation-service.webp'
import { Button } from '@/components/ui/Button'
import { siteConfig } from '@/data/site'

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-surface-inverted text-white">
      <img
        src={congregationPhoto}
        alt="The NFPC congregation gathered for a service"
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-40 sm:px-6 lg:px-8 lg:pb-28">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-200">
          {siteConfig.motto}
        </p>
        <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
          {siteConfig.name}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/85">
          A place of worship and community. Join us as we grow in faith, serve one another, and
          reach our city together.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button to="/contact" variant="primary" className="text-base">
            Plan Your Visit
          </Button>
          <Button
            to="/sermons"
            variant="secondary"
            className="border-white/30 bg-white/10 text-base text-white backdrop-blur hover:bg-white/20"
          >
            Explore Sermons
          </Button>
        </div>
      </div>
    </section>
  )
}
