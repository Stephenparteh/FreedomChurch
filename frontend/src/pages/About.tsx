import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { AsyncList } from '@/components/shared/AsyncList'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { useApi } from '@/hooks/useApi'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { getLeadership } from '@/lib/api/resources'

const congregationPhoto = '/photos/congregation-worship.webp'

const faithPillars = [
  { title: 'Scripture', body: 'Placeholder — confirm real doctrinal statement with church leadership.' },
  { title: 'Love', body: 'Placeholder — confirm real doctrinal statement with church leadership.' },
  { title: 'Prayer', body: 'Placeholder — confirm real doctrinal statement with church leadership.' },
  { title: 'Community', body: 'Placeholder — confirm real doctrinal statement with church leadership.' },
]

export function About() {
  usePageMeta('About', 'Learn about the mission, history, and leadership of NFPC.')
  const { motto } = useSiteSettings()
  const leadershipState = useApi(() => getLeadership(), [])

  return (
    <>
      <PageHero
        eyebrow={motto || undefined}
        title="Our vision & mission"
        description="Placeholder copy — replace with confirmed mission and vision statements. The legacy site's version of this text read as generic template copy (see docs/LEGACY_AUDIT.md) and should not be treated as final."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="aspect-[4/3] overflow-hidden rounded-xl">
              <img
                src={congregationPhoto}
                alt="The NFPC congregation gathered in worship"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <h2 className="text-3xl font-semibold text-text">Our history</h2>
            <p className="mt-4 text-text-muted">
              TODO_CONFIRM_HISTORY — the legacy site's founding narrative read as generic
              placeholder text (a 1990 founding, a 2005 expansion) rather than confirmed facts.
              Do not publish it as real history until confirmed with church leadership.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section tone="muted">
        <Reveal>
          <h2 className="text-3xl font-semibold text-text">Leadership</h2>
          <p className="mt-2 max-w-2xl text-text-muted">
            Leadership bios and photos are managed from the admin dashboard once confirmed by
            church leadership — see docs/MISSING_CONTENT.md.
          </p>
        </Reveal>
        <AsyncList
          state={leadershipState}
          loadingLabel="Loading leadership..."
          emptyTitle="Leadership bios coming soon"
          emptyDescription="This section will populate once church leadership confirms names, roles, and bios."
          errorTitle="Unable to load leadership"
          className="mt-8"
        >
          {(members) => (
            <div className="grid gap-6 sm:grid-cols-3">
              {members.map((member, index) => (
                <Reveal key={member.id} delay={index * 100}>
                  <Card className="h-full text-center">
                    <div
                      className="mx-auto h-24 w-24 rounded-full bg-surface-muted bg-cover bg-center"
                      style={member.image ? { backgroundImage: `url(${member.image})` } : undefined}
                      aria-hidden
                    />
                    <p className="mt-4 font-medium text-text">{member.name}</p>
                    <p className="text-sm text-text-muted">{member.role}</p>
                  </Card>
                </Reveal>
              ))}
            </div>
          )}
        </AsyncList>
      </Section>

      <Section>
        <Reveal>
          <h2 className="text-3xl font-semibold text-text">Our faith</h2>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {faithPillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 100}>
              <Card className="h-full">
                <h3 className="font-semibold text-text">{pillar.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{pillar.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  )
}
