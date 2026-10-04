import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { AsyncList } from '@/components/shared/AsyncList'
import { Reveal } from '@/components/shared/Reveal'
import { useApi } from '@/hooks/useApi'
import { getMinistries } from '@/lib/api/resources'

export function MinistriesPreview() {
  const state = useApi(() => getMinistries(), [])

  return (
    <Section tone="muted">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              Get involved
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-text sm:text-4xl">Our ministries</h2>
          </div>
          <Button to="/ministries" variant="link">
            View all ministries &rarr;
          </Button>
        </div>
      </Reveal>

      <AsyncList
        state={state}
        loadingLabel="Loading ministries..."
        emptyTitle="Ministries coming soon"
        emptyDescription="Ministry information will appear here once it's added from the admin dashboard."
        errorTitle="Unable to load ministries"
      >
        {(ministries) => (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ministries.slice(0, 3).map((ministry, index) => (
              <Reveal key={ministry.id} delay={index * 100}>
                <Card interactive className="h-full">
                  <h3 className="text-lg font-semibold text-text">{ministry.name}</h3>
                  <p className="mt-2 text-sm text-text-muted">{ministry.shortDescription}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </AsyncList>
    </Section>
  )
}
