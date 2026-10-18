import { useEffect, useState, type FormEvent } from 'react'
import { AdminPage } from '@/components/admin/AdminPage'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StateMessage } from '@/components/shared/StateMessage'
import { usePageMeta } from '@/hooks/usePageMeta'
import { adminSettings } from '@/lib/api/admin'
import { ApiClientError } from '@/lib/api/client'

const FIELDS: { name: string; label: string; type?: 'textarea' | 'email' | 'url'; required?: boolean; help?: string }[] = [
  { name: 'churchName', label: 'Church name', required: true },
  { name: 'motto', label: 'Motto' },
  { name: 'description', label: 'Short description', type: 'textarea' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone' },
  { name: 'address', label: 'Address' },
  { name: 'footerNote', label: 'Footer note', type: 'textarea', help: 'Shown in the website footer.' },
]
const SOCIALS = [
  { name: 'facebook', label: 'Facebook link' },
  { name: 'instagram', label: 'Instagram link' },
  { name: 'twitter', label: 'X (Twitter) link' },
]

type Values = Record<string, string>
interface GivingMethodRow {
  title: string
  instructions: string
}

/** Church-wide information. Unconfirmed values stay empty until the church supplies them. */
export function AdminSettings() {
  usePageMeta('Admin settings')
  const [values, setValues] = useState<Values | null>(null)
  const [givingMethods, setGivingMethods] = useState<GivingMethodRow[]>([])
  const [loadError, setLoadError] = useState('')
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    adminSettings
      .get()
      .then(({ data }) => {
        const socials = (data.socials ?? {}) as Record<string, string | undefined>
        const next: Values = {}
        for (const f of FIELDS) next[f.name] = typeof data[f.name] === 'string' ? (data[f.name] as string) : ''
        for (const s of SOCIALS) next[s.name] = socials[s.name] ?? ''
        setValues(next)
        const methods = Array.isArray(data.givingMethods) ? (data.givingMethods as GivingMethodRow[]) : []
        setGivingMethods(methods.map((m) => ({ title: m.title ?? '', instructions: m.instructions ?? '' })))
      })
      .catch((err: unknown) => setLoadError(err instanceof Error ? err.message : 'Could not load settings.'))
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!values) return
    if (!values.churchName?.trim()) {
      setFormError('Church name is required.')
      return
    }
    setSaving(true)
    setFormError('')
    setNotice('')
    try {
      // Empty strings clear a value on the server; that's how a field returns to "not confirmed".
      const socials = Object.fromEntries(SOCIALS.map((s) => [s.name, values[s.name]?.trim() ?? '']))
      const payload: Record<string, unknown> = { socials }
      for (const f of FIELDS) payload[f.name] = (values[f.name] ?? '').trim()
      // Drop rows the admin left blank rather than saving an empty giving method.
      payload.givingMethods = givingMethods
        .map((m) => ({ title: m.title.trim(), instructions: m.instructions.trim() }))
        .filter((m) => m.title !== '')
      const { data } = await adminSettings.update(payload)
      setNotice('Settings saved. The website shows the new values.')
      setValues((prev) => ({ ...(prev ?? {}), churchName: String(data.churchName ?? prev?.churchName ?? '') }))
    } catch (err) {
      setFormError(err instanceof ApiClientError ? err.message : 'Could not save settings.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'field-input'

  return (
    <AdminPage
      title="Site settings"
      description="Church name, contact details, and footer text. A field left empty is hidden from the website. Service times are managed under Service sessions."
    >
      {loadError && <StateMessage tone="error" title="Could not load settings" description={loadError} />}
      {!values && !loadError && <StateMessage title="Loading settings..." />}

      {values && (
        <Card>
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {notice && (
              <p role="status" className="rounded-md border border-success/30 bg-success/5 px-4 py-3 text-sm text-success">
                {notice}
              </p>
            )}
            {formError && (
              <p role="alert" className="rounded-md border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
                {formError}
              </p>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              {FIELDS.map((f) => (
                <div key={f.name} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label htmlFor={`setting-${f.name}`} className="block text-sm font-medium text-text">
                    {f.label}
                    {f.required && <span className="text-error" aria-hidden> *</span>}
                  </label>
                  {f.type === 'textarea' ? (
                    <textarea
                      id={`setting-${f.name}`}
                      rows={3}
                      className={inputClass}
                      value={values[f.name] ?? ''}
                      onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                    />
                  ) : (
                    <input
                      id={`setting-${f.name}`}
                      type={f.type ?? 'text'}
                      required={f.required}
                      className={inputClass}
                      value={values[f.name] ?? ''}
                      onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                    />
                  )}
                  {f.help && <p className="mt-1 text-xs text-text-muted">{f.help}</p>}
                </div>
              ))}
            </div>

            <fieldset>
              <legend className="text-sm font-semibold text-text">Social links</legend>
              <div className="mt-3 grid gap-5 md:grid-cols-3">
                {SOCIALS.map((s) => (
                  <div key={s.name}>
                    <label htmlFor={`setting-${s.name}`} className="block text-sm font-medium text-text">
                      {s.label}
                    </label>
                    <input
                      id={`setting-${s.name}`}
                      type="url"
                      className={inputClass}
                      value={values[s.name] ?? ''}
                      onChange={(e) => setValues({ ...values, [s.name]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold text-text">Giving methods</legend>
              <p className="mt-1 text-xs text-text-muted">
                Shown on the Give page under "Ways to give", in this order. Only methods the church has confirmed
                should go here — nothing is shown on the website until you add it. "Give in person" is always shown
                separately and uses the address above, so it doesn't need a row here.
              </p>

              <div className="mt-4 space-y-5">
                {givingMethods.map((method, index) => (
                  <div key={index} className="rounded-md border border-border-strong p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <label htmlFor={`giving-title-${index}`} className="block text-sm font-medium text-text">
                          Method name
                        </label>
                        <input
                          id={`giving-title-${index}`}
                          type="text"
                          placeholder="e.g. Orange Money"
                          className={inputClass}
                          value={method.title}
                          onChange={(e) =>
                            setGivingMethods((rows) => rows.map((r, i) => (i === index ? { ...r, title: e.target.value } : r)))
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="mt-6"
                        onClick={() => setGivingMethods((rows) => rows.filter((_, i) => i !== index))}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="mt-3">
                      <label htmlFor={`giving-instructions-${index}`} className="block text-sm font-medium text-text">
                        Instructions
                      </label>
                      <textarea
                        id={`giving-instructions-${index}`}
                        rows={3}
                        placeholder="Write exactly what a giver needs to see, e.g. the number and account name."
                        className={inputClass}
                        value={method.instructions}
                        onChange={(e) =>
                          setGivingMethods((rows) => rows.map((r, i) => (i === index ? { ...r, instructions: e.target.value } : r)))
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="secondary"
                className="mt-4"
                onClick={() => setGivingMethods((rows) => [...rows, { title: '', instructions: '' }])}
              >
                Add giving method
              </Button>
            </fieldset>

            <div>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save settings'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </AdminPage>
  )
}
