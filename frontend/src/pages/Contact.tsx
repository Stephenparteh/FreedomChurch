import { type FormEvent, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { StateMessage } from '@/components/shared/StateMessage'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useServiceSessions, formatSessionTime } from '@/hooks/useServiceSessions'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { ApiClientError } from '@/lib/api/client'
import { submitContact } from '@/lib/api/resources'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export function Contact() {
  usePageMeta('Contact', 'Get in touch with NFPC.')
  const { email, phone, address } = useSiteSettings()
  const { sessions } = useServiceSessions()
  const [state, setState] = useState<SubmitState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    setState('submitting')
    try {
      await submitContact({
        name: String(formData.get('name') ?? ''),
        email: String(formData.get('email') ?? ''),
        message: String(formData.get('message') ?? ''),
      })
      setState('success')
      form.reset()
    } catch (err) {
      setState('error')
      setErrorMessage(
        err instanceof ApiClientError ? err.message : 'Something went wrong. Please try again.',
      )
    }
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
              {state === 'success' ? (
                <StateMessage
                  title="Message sent"
                  description="Thank you for reaching out — we'll get back to you soon."
                  action={
                    <Button variant="secondary" onClick={() => setState('idle')}>
                      Send another message
                    </Button>
                  }
                />
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                  {state === 'error' && (
                    <StateMessage tone="error" title="Couldn't send your message" description={errorMessage} />
                  )}
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
                      disabled={state === 'submitting'}
                      className="mt-1 w-full rounded-md border border-border-strong px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-primary-500 disabled:opacity-50"
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
                      disabled={state === 'submitting'}
                      className="mt-1 w-full rounded-md border border-border-strong px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-primary-500 disabled:opacity-50"
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
                      disabled={state === 'submitting'}
                      className="mt-1 w-full rounded-md border border-border-strong px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-primary-500 disabled:opacity-50"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={state === 'submitting'}>
                    {state === 'submitting' ? 'Sending...' : 'Send message'}
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
                  <dd>{email}</dd>
                </div>
                <div>
                  <dt className="font-medium text-text">Phone</dt>
                  <dd>{phone}</dd>
                </div>
                <div>
                  <dt className="font-medium text-text">Address</dt>
                  <dd>{address}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text">Service times</h2>
              {sessions.length === 0 ? (
                <p className="mt-4 text-sm text-text-muted">Coming soon.</p>
              ) : (
                <ul className="mt-4 space-y-2 text-sm text-text-muted">
                  {sessions.map((session) => (
                    <li key={session.id}>
                      <span className="font-medium text-text">{session.name}</span> &middot; {session.dayOfWeek},{' '}
                      {formatSessionTime(session)}
                    </li>
                  ))}
                </ul>
              )}
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
