import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { AsyncList } from '@/components/shared/AsyncList'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { useApi } from '@/hooks/useApi'
import { usePageMeta } from '@/hooks/usePageMeta'
import { getMinistries } from '@/lib/api/resources'

import { resolveMediaUrl } from '@/lib/media'

export function Ministries() {
  usePageMeta('Ministries', 'Explore the ministries you can join or support at NFPC.')
  const state = useApi(() => getMinistries(), [])

  return (
    <>
      <PageHero
        eyebrow="Get involved"
        title="Our ministries"
        description="Explore the various ministries you can join or support."
      />

      <Section>
        <AsyncList
          state={state}
          loadingLabel="Loading ministries..."
          emptyTitle="Ministries coming soon"
          emptyDescription="Ministry information will appear here once it's added from the admin dashboard."
          errorTitle="Unable to load ministries"
          className=""
        >
          {(ministries) => (
            <div className="space-y-16 sm:space-y-20">
              {ministries.map((ministry, index) => {
                const reversed = index % 2 === 1
                return (
                  <Reveal key={ministry.id}>
                    <div
                      className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                        reversed ? 'lg:[&>*:first-child]:order-2' : ''
                      }`}
                    >
                      <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-primary-50">
                        {ministry.image ? (
                          <img
                            src={resolveMediaUrl(ministry.image)}
                            alt=""
                            className="h-full w-full rounded-xl object-cover"
                          />
                        ) : (
                          <span className="font-display text-8xl font-semibold text-primary-200">
                            {ministry.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-text sm:text-3xl">
                          {ministry.name}
                        </h2>
                        <p className="mt-4 text-text-muted">{ministry.description}</p>
                        {ministry.meetingInfo && (
                          <p className="mt-4 text-sm font-medium text-text">
                            Meets:{' '}
                            <span className="font-normal text-text-muted">
                              {ministry.meetingInfo}
                            </span>
                          </p>
                        )}
                        <div className="mt-6">
                          <Button to="/contact" variant="secondary">
                            Get involved
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          )}
        </AsyncList>
      </Section>
    </>
  )
}
