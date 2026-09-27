import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { placeholderMinistries } from '@/data/placeholders'
import { usePageMeta } from '@/hooks/usePageMeta'

export function Ministries() {
  usePageMeta('Ministries', 'Explore the ministries you can join or support at NFPC.')

  return (
    <>
      <PageHero
        eyebrow="Get involved"
        title="Our ministries"
        description="Explore the various ministries you can join or support. Descriptions below are placeholder copy pending confirmation from church leadership — see docs/MISSING_CONTENT.md."
      />

      <Section>
        <div className="space-y-16 sm:space-y-20">
          {placeholderMinistries.map((ministry, index) => {
            const reversed = index % 2 === 1
            return (
              <Reveal key={ministry.id}>
                <div
                  className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                    reversed ? 'lg:[&>*:first-child]:order-2' : ''
                  }`}
                >
                  <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-primary-50">
                    <span className="font-display text-8xl font-semibold text-primary-200">
                      {ministry.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-text sm:text-3xl">
                      {ministry.name}
                    </h2>
                    <p className="mt-4 text-text-muted">{ministry.description}</p>
                    {ministry.meetingInfo && (
                      <p className="mt-4 text-sm font-medium text-text">
                        Meets: <span className="font-normal text-text-muted">{ministry.meetingInfo}</span>
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
      </Section>
    </>
  )
}
