import { type FormEvent, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { StateMessage } from '@/components/shared/StateMessage'
import { serviceTimes, siteConfig } from '@/data/site'
import { usePageMeta } from '@/hooks/usePageMeta'

export function Contact() {
  usePageMeta('Contact', 'Get in touch with NFPC.')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // No backend exists yet (Milestone 3 adds the contact-submission API).
    setSubmitted(true)
  }

  return (
    <>
      <PageHero
        eyebrow="We'd love to hear from you"
        title="Contact us"
        description="Fill out the form below or reach out using the details to the side."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <Card>
              {submitted ? (
                <StateMessage
                  title="Form submission isn't connected yet"
                  description="This form doesn't send anywhere yet — the contact-submission API is planned for Milestone 3 (see docs/BACKEND_PLAN.md)."
                  action={
                    <Button variant="secondary" onClick={() => setSubmitted(false)}>
                      Back to form
                    </Button>
                  }
                />
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      minLength={2}
                      className="mt-1 w-full rounded-md border border-border-strong px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="mt-1 w-full rounded-md border border-border-strong px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-text">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      minLength={10}
                      className="mt-1 w-full rounded-md border border-border-strong px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-primary-500"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send message
                  </Button>
                </form>
              )}
            </Card>
          </Reveal>

          <Reveal delay={150} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-text">Contact information</h2>
              <dl className="mt-4 space-y-3 text-sm text-text-muted">
                <div>
                  <dt className="font-medium text-text">Email</dt>
                  <dd>{siteConfig.email}</dd>
                </div>
                <div>
                  <dt className="font-medium text-text">Phone</dt>
                  <dd>{siteConfig.phone}</dd>
                </div>
                <div>
                  <dt className="font-medium text-text">Address</dt>
                  <dd>{siteConfig.address}</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs text-text-muted">
                These details are unverified placeholders — the legacy site listed conflicting
                contact information across pages. See docs/LEGACY_AUDIT.md.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text">Service times</h2>
              <ul className="mt-4 space-y-2 text-sm text-text-muted">
                {serviceTimes.map((service) => (
                  <li key={service.label}>
                    <span className="font-medium text-text">{service.label}</span> &middot;{' '}
                    {service.day}, {service.time}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-border-strong bg-surface-muted text-center text-sm text-text-muted">
              Map will appear here once the church address is confirmed.
              <br />
              (The legacy site's map pointed at the wrong country.)
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
