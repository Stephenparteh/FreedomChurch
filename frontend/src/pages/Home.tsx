import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { placeholderEvents, placeholderSermons } from '@/data/placeholders'
import { usePageMeta } from '@/hooks/usePageMeta'

export function Home() {
  usePageMeta(
    'Home',
    'National Freedom Pentecostal Church — a place of worship and community.',
  )

  return (
    <>
      <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-surface-inverted text-text-inverted">
        <div className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-300">
            Welcome home
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold leading-tight sm:text-6xl">
            National Freedom Pentecostal Church
          </h1>
          <p className="mt-6 max-w-xl text-lg text-text-inverted/80">
            A place of worship and community. Join us as we grow in faith, serve one another, and
            reach our city together.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button to="/events" variant="primary">
              Join Us This Sunday
            </Button>
            <Button to="/sermons" variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Watch Latest Sermon
            </Button>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              About us
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-text sm:text-4xl">
              Our mission and values
            </h2>
            <p className="mt-4 text-text-muted">
              Placeholder copy — replace with confirmed mission/vision content from church
              leadership (see docs/LEGACY_AUDIT.md for what was captured from the legacy site).
            </p>
            <div className="mt-6">
              <Button to="/about" variant="link">
                Read more about us &rarr;
              </Button>
            </div>
          </div>
          <div className="aspect-[4/3] rounded-xl bg-surface-muted" aria-hidden />
        </div>
      </Section>

      <Section tone="muted">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold text-text sm:text-4xl">Recent sermons</h2>
          <Button to="/sermons" variant="link">
            View all sermons &rarr;
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeholderSermons.map((sermon) => (
            <Card key={sermon.id}>
              <h3 className="text-lg font-semibold text-text">{sermon.title}</h3>
              <p className="mt-1 text-sm text-text-muted">{sermon.preacher}</p>
              <p className="mt-3 text-sm text-text-muted">{sermon.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold text-text sm:text-4xl">Upcoming events</h2>
          <Button to="/events" variant="link">
            View all events &rarr;
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {placeholderEvents.map((event) => (
            <Card key={event.id}>
              <h3 className="text-lg font-semibold text-text">{event.title}</h3>
              <p className="mt-1 text-sm text-text-muted">{event.date}</p>
              <p className="mt-3 text-sm text-text-muted">{event.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="inverted" className="text-center">
        <h2 className="text-3xl font-semibold sm:text-4xl">Join us in our mission</h2>
        <p className="mx-auto mt-4 max-w-xl text-text-inverted/80">
          Be part of something bigger. Get involved and make a difference in our community.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button to="/contact" variant="secondary" className="bg-white text-primary-700">
            Get Involved
          </Button>
          <Button to="/give" variant="primary">
            Give
          </Button>
        </div>
      </Section>
    </>
  )
}
