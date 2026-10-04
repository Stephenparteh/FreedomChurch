import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/shared/Reveal'
import { StateMessage } from '@/components/shared/StateMessage'
import { useServiceSessions, formatSessionTime, PLATFORM_LABEL } from '@/hooks/useServiceSessions'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export function ServiceInfo() {
  const { isLoading, address } = useSiteSettings()
  const sessions = useServiceSessions()

  return (
    <Section tone="muted">
      <Reveal>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Join us</p>
          <h2 className="mt-2 text-3xl font-semibold text-text sm:text-4xl">When &amp; where we gather</h2>
        </div>
      </Reveal>

      {sessions.isLoading || isLoading ? (
        <StateMessage className="mt-10" title="Loading service information..." />
      ) : sessions.isError ? (
        <StateMessage tone="error" className="mt-10" title="Unable to load service information" />
      ) : sessions.sessions.length === 0 ? (
        <StateMessage
          className="mt-10"
          title="Service times coming soon"
          description="Our schedule will appear here once it's confirmed and published."
        />
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.sessions.map((session, index) => (
            <Reveal key={session.id} delay={index * 100}>
              <Card className="h-full">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">{session.dayOfWeek}</p>
                <h3 className="mt-2 text-lg font-semibold text-text">{session.name}</h3>
                <p className="mt-1 text-text-muted">{formatSessionTime(session)}</p>
                <p className="mt-1 text-sm text-text-muted">{PLATFORM_LABEL[session.platform]}</p>
                {session.description && <p className="mt-3 text-sm text-text-muted">{session.description}</p>}
                {session.meetingUrl && (
                  <a href={session.meetingUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-primary-600 underline">
                    Join online
                  </a>
                )}
              </Card>
            </Reveal>
          ))}
          <Reveal delay={sessions.sessions.length * 100}>
            <Card className="h-full">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Location</p>
              <h3 className="mt-2 text-lg font-semibold text-text">Where to find us</h3>
              <p className="mt-1 text-text-muted">{address}</p>
            </Card>
          </Reveal>
        </div>
      )}
    </Section>
  )
}
