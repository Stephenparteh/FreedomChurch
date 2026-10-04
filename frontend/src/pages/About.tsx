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
  { title: 'Scripture', body: 'TODO_CONFIRM_FAITH_STATEMENT' },
  { title: 'Love', body: 'TODO_CONFIRM_FAITH_STATEMENT' },
  { title: 'Prayer', body: 'TODO_CONFIRM_FAITH_STATEMENT' },
  { title: 'Community', body: 'TODO_CONFIRM_FAITH_STATEMENT' },
]

import { resolveMediaUrl } from '@/lib/media'

export function About() {
  usePageMeta('About', 'Learn about the mission, history, and leadership of NFPC.')
  const { motto } = useSiteSettings()
  const leadershipState = useApi(() => getLeadership(), [])

  return (
    <>
      <PageHero
        eyebrow={motto || undefined}
        title="Our vision & mission"
        description="TODO_CONFIRM_MISSION_STATEMENT"
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
              TODO_CONFIRM_HISTORY
            </p>
          </Reveal>
        </div>
      </Section>

      <Section tone="muted">
        <Reveal>
          <h2 className="text-3xl font-semibold text-text">Leadership</h2>
          <p className="mt-2 max-w-2xl text-text-muted">
            TODO_CONFIRM_LEADERSHIP_INTRO
          </p>
        </Reveal>
        <AsyncList
          state={leadershipState}
          loadingLabel="Loading leadership..."
          emptyTitle="Leadership bios coming soon"
          emptyDescription="Information about our leadership will be shared here."
          errorTitle="Unable to load leadership"
          className="mt-8"
        >
          {(members) => (
            <div className="grid gap-6 sm:grid-cols-3">
              {members.map((member, index) => (
                <Reveal key={member.id} delay={index * 100}>
                  <Card className="h-full text-center">
                    {resolveMediaUrl(member.image) ? (
                      <img src={resolveMediaUrl(member.image)} alt="" className="mx-auto h-24 w-24 rounded-full object-cover" />
                    ) : (
                      <div className="mx-auto h-24 w-24 rounded-full bg-surface-muted" aria-hidden />
                    )}
                    <p className="mt-4 font-medium text-text">{member.name}</p>
                    <p className="text-sm text-text-muted">{member.role}</p>
                    {member.bio && <p className="mt-3 text-sm text-text-muted">{member.bio}</p>}
                    {member.socialLinks && Object.values(member.socialLinks).some(Boolean) && (
                      <ul className="mt-3 flex flex-wrap justify-center gap-3 text-sm">
                        {Object.entries(member.socialLinks)
                          .filter(([, url]) => Boolean(url))
                          .map(([name, url]) => (
                            <li key={name}>
                              <a href={url} target="_blank" rel="noreferrer" className="text-primary-600 underline">
                                {name === 'twitter' ? 'X' : name.charAt(0).toUpperCase() + name.slice(1)}
                              </a>
                            </li>
                          ))}
                      </ul>
                    )}
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
