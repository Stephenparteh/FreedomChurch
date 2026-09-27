import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/shared/PageHero'
import { usePageMeta } from '@/hooks/usePageMeta'

const faithPillars = [
  { title: 'Scripture', body: 'Placeholder — confirm real doctrinal statement with church leadership.' },
  { title: 'Love', body: 'Placeholder — confirm real doctrinal statement with church leadership.' },
  { title: 'Prayer', body: 'Placeholder — confirm real doctrinal statement with church leadership.' },
  { title: 'Community', body: 'Placeholder — confirm real doctrinal statement with church leadership.' },
]

export function About() {
  usePageMeta('About', 'Learn about the mission, history, and leadership of NFPC.')

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Our vision & mission"
        description="Placeholder copy — replace with confirmed mission and vision statements. The legacy site's version of this text read as generic template copy (see docs/LEGACY_AUDIT.md) and should not be treated as final."
      />

      <Section>
        <h2 className="text-3xl font-semibold text-text">Our history</h2>
        <p className="mt-4 max-w-2xl text-text-muted">
          TODO_CONFIRM_HISTORY — the legacy site's founding narrative read as generic
          placeholder text (a 1990 founding, a 2005 expansion) rather than confirmed facts.
          Do not publish it as real history until confirmed with church leadership.
        </p>
      </Section>

      <Section tone="muted">
        <h2 className="text-3xl font-semibold text-text">Leadership</h2>
        <p className="mt-2 max-w-2xl text-text-muted">
          TODO_CONFIRM_LEADERSHIP — the legacy site used placeholder names ("Pastor John Doe",
          etc.). Real leadership bios and photos are required before this section can ship.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-surface-muted" aria-hidden />
              <p className="mt-4 font-medium text-text">TODO_CONFIRM_NAME</p>
              <p className="text-sm text-text-muted">TODO_CONFIRM_ROLE</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl font-semibold text-text">Our faith</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {faithPillars.map((pillar) => (
            <Card key={pillar.title}>
              <h3 className="font-semibold text-text">{pillar.title}</h3>
              <p className="mt-2 text-sm text-text-muted">{pillar.body}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}
