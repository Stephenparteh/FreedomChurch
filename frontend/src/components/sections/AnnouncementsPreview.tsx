import { AsyncList } from '@/components/shared/AsyncList'
import { Reveal } from '@/components/shared/Reveal'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { useApi } from '@/hooks/useApi'
import { getAnnouncements } from '@/lib/api/resources'
import { resolveMediaUrl } from '@/lib/media'

/** Latest published announcements. Archived ones never reach the website. */
export function AnnouncementsPreview() {
  const state = useApi(() => getAnnouncements({ limit: 3 }), [])

  return (
    <Section tone="muted">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Announcements</p>
        <h2 className="mt-2 text-3xl font-semibold text-text sm:text-4xl">What's new</h2>
      </Reveal>
      <AsyncList
        state={state}
        loadingLabel="Loading announcements..."
        emptyTitle="No announcements right now"
        emptyDescription="Church announcements will appear here when they are published."
        errorTitle="Unable to load announcements"
      >
        {(items) => (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {items.map((item, index) => (
              <Reveal key={item.id} delay={index * 100}>
                <Card className="h-full">
                  {resolveMediaUrl(item.image) && (
                    <img src={resolveMediaUrl(item.image)} alt="" className="mb-4 aspect-video w-full rounded-md object-cover" />
                  )}
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                    {new Date(item.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-text">{item.title}</h3>
                  <p className="mt-3 whitespace-pre-line text-sm text-text-muted">{item.content}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </AsyncList>
    </Section>
  )
}
