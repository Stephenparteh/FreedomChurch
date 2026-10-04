import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/shared/PageHero'
import { StateMessage } from '@/components/shared/StateMessage'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export function Give() {
  usePageMeta('Give', 'Support the mission of NFPC.')
  const { email, address } = useSiteSettings()

  return (
    <>
      <PageHero
        eyebrow="Support our mission"
        title="Give"
        description="Your generosity helps sustain our ministries and outreach."
      />

      <Section>
        <div className="mx-auto max-w-xl">
          <StateMessage
            title="Online giving isn't available yet"
            description="Payment processing is intentionally out of scope for this milestone. Once a processor is selected, this page will host a secure giving form."
          />
          <Card className="mt-8">
            <h2 className="text-lg font-semibold text-text">Other ways to give</h2>
            <dl className="mt-4 space-y-3 text-sm text-text-muted">
              <div>
                <dt className="font-medium text-text">In person</dt>
                <dd>During any service at {address}</dd>
              </div>
              <div>
                <dt className="font-medium text-text">Contact</dt>
                <dd>{email}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </Section>
    </>
  )
}
