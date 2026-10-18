import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StateMessage } from '@/components/shared/StateMessage'
import { adminResource, type AdminRecord } from '@/lib/api/admin'
import { ApiClientError } from '@/lib/api/client'
import {
  payloadFromValues,
  validateRequired,
  valuesFromRecord,
  type FieldConfig,
  type FormValues,
} from '@/lib/admin/forms'
import { cn } from '@/lib/cn'
import { resolveMediaUrl } from '@/lib/media'
import { ImageField } from './ImageField'
import { AdminPage } from './AdminPage'

export interface ResourceConfig {
  /** API path segment under /api/admin, e.g. "sermons". */
  segment: string
  /** Page title and heading. */
  title: string
  description: string
  /** Noun for messages, e.g. "sermon". */
  noun: string
  fields: FieldConfig[]
  /** Primary text for a list row. */
  label: (record: AdminRecord) => string
  /** Secondary text for a list row. */
  detail?: (record: AdminRecord) => string
  /** Whether the record has a published/draft state. */
  publishable: boolean
  /** Defaults for a new record's form. */
  blank: FormValues
  /** Maps a stored record to flat form fields, when the API nests values. */
  hydrate?: (record: AdminRecord) => AdminRecord
  /** Maps flat form payload keys back to the API's shape, when the API nests values. */
  prepare?: (payload: Record<string, unknown>) => Record<string, unknown>
}

type Editor = { mode: 'create' } | { mode: 'edit'; record: AdminRecord } | null

/**
 * One generic list-and-form screen, used by every CMS section. The per-resource
 * differences (fields, labels, publishing) come from ResourceConfig.
 * Desktop shows a table; mobile stacks each record as a row.
 */
export function CrudPage({ config }: { config: ResourceConfig }) {
  const api = useMemo(() => adminResource(config.segment), [config.segment])
  // Whichever field holds the record's image, if it has one — drives the list thumbnail below.
  const imageField = useMemo(() => config.fields.find((f) => f.kind === 'image')?.name, [config.fields])
  const [items, setItems] = useState<AdminRecord[]>([])
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [loadError, setLoadError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [editor, setEditor] = useState<Editor>(null)
  const [values, setValues] = useState<FormValues>(config.blank)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')

  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [rowError, setRowError] = useState('')

  useEffect(() => {
    let cancelled = false
    api
      .list({ limit: 100 })
      .then(({ data }) => {
        if (cancelled) return
        setItems(data)
        setLoadState('ready')
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setLoadError(messageOf(err))
        setLoadState('error')
      })
    return () => {
      cancelled = true
    }
  }, [api, reloadKey])

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])

  function preparePayload(payload: Record<string, unknown>) {
    return config.prepare ? config.prepare(payload) : payload
  }

  function openCreate() {
    setEditor({ mode: 'create' })
    setValues(config.blank)
    setFormError('')
    setNotice('')
  }

  function openEdit(record: AdminRecord) {
    setEditor({ mode: 'edit', record })
    setValues(valuesFromRecord(config.hydrate ? config.hydrate(record) : record, config.fields))
    setFormError('')
    setNotice('')
  }

  function closeEditor() {
    setEditor(null)
    setFormError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editor) return
    const missing = validateRequired(values, config.fields)
    if (missing) {
      setFormError(missing)
      return
    }
    setSaving(true)
    setFormError('')
    try {
      if (editor.mode === 'create') {
        await api.create(preparePayload(payloadFromValues(values, config.fields, 'create')))
        setNotice(`${capitalize(config.noun)} created.`)
      } else {
        await api.update(editor.record.id, preparePayload(payloadFromValues(values, config.fields, 'update')))
        setNotice(`${capitalize(config.noun)} saved.`)
      }
      setEditor(null)
      reload()
    } catch (err) {
      setFormError(messageOf(err))
    } finally {
      setSaving(false)
    }
  }

  async function togglePublished(record: AdminRecord) {
    setBusyId(record.id)
    setRowError('')
    try {
      await api.update(record.id, { isPublished: !record.isPublished })
      setNotice(record.isPublished ? `${capitalize(config.noun)} hidden from the website.` : `${capitalize(config.noun)} published.`)
      reload()
    } catch (err) {
      setRowError(messageOf(err))
    } finally {
      setBusyId(null)
    }
  }

  async function remove(record: AdminRecord) {
    setBusyId(record.id)
    setRowError('')
    try {
      await api.remove(record.id)
      setConfirmId(null)
      setNotice(`${capitalize(config.noun)} deleted.`)
      reload()
    } catch (err) {
      setRowError(messageOf(err))
    } finally {
      setBusyId(null)
    }
  }

  const newButton = (
    <Button type="button" onClick={openCreate}>
      New {config.noun}
    </Button>
  )

  return (
    <AdminPage title={config.title} description={config.description} actions={newButton}>
      {notice && (
        <p role="status" className="mb-6 rounded-md border border-success/30 bg-success/5 px-4 py-3 text-sm text-success">
          {notice}
        </p>
      )}

      {editor && (
        <Card className="mb-10 p-6 sm:p-10">
          <form onSubmit={handleSubmit} noValidate aria-labelledby="crud-form-title">
            <h2 id="crud-form-title" className="display-md text-text">
              {editor.mode === 'create' ? `New ${config.noun}` : `Edit ${config.noun}`}
            </h2>
            {formError && (
              <p role="alert" className="mt-6 rounded-md border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
                {formError}
              </p>
            )}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {config.fields.map((field) => (
                <div key={field.name} className={field.full || field.kind === 'textarea' || field.kind === 'image' ? 'md:col-span-2' : ''}>
                  <FieldInput
                    field={field}
                    value={values[field.name]}
                    onChange={(v) => setValues((prev) => ({ ...prev, [field.name]: v }))}
                    id={`field-${config.segment}-${field.name}`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3 border-t border-border pt-8">
              <Button type="submit" disabled={saving} className="min-w-32">
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button type="button" variant="secondary" onClick={closeEditor} disabled={saving}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loadState === 'loading' && <StateMessage title={`Loading ${config.title.toLowerCase()}...`} />}
      {loadState === 'error' && (
        <StateMessage
          tone="error"
          title={`Could not load ${config.title.toLowerCase()}`}
          description={loadError}
          action={
            <Button variant="secondary" onClick={reload}>
              Try again
            </Button>
          }
        />
      )}
      {loadState === 'ready' && items.length === 0 && (
        <StateMessage
          title={`No ${config.title.toLowerCase()} yet`}
          description={`Use "New ${config.noun}" to add one. Nothing appears on the website until it is published.`}
        />
      )}

      {loadState === 'ready' && items.length > 0 && (
        <>
          {rowError && (
            <p role="alert" className="mb-6 rounded-md border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
              {rowError}
            </p>
          )}
          <ul aria-label={config.title} className="overflow-hidden rounded-lg border border-border bg-surface divide-y divide-border">
            {items.map((record) => {
              const isConfirming = confirmId === record.id
              const isBusy = busyId === record.id
              const thumb = imageField ? resolveMediaUrl(typeof record[imageField] === 'string' ? (record[imageField] as string) : undefined) : undefined
              return (
                <li key={record.id} className="grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6">
                  <div className="flex min-w-0 items-center gap-4">
                    {imageField && (
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                        {thumb ? (
                          <img src={thumb} alt="" className="h-full w-full object-cover" loading="lazy" />
                        ) : (
                          <div aria-hidden className="flex h-full items-center justify-center text-text-muted/50">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="m21 15-5-5L5 21" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-display text-lg font-semibold text-text">{config.label(record)}</p>
                        {config.publishable && <StatusBadge published={Boolean(record.isPublished)} />}
                        {record.isArchived === true && <Badge>Archived</Badge>}
                      </div>
                      {config.detail && <p className="mt-1 truncate text-sm text-text-muted">{config.detail(record)}</p>}
                    </div>
                  </div>

                  {isConfirming ? (
                    <div className="flex flex-col gap-3 sm:items-end" role="group" aria-label={`Confirm delete ${config.label(record)}`}>
                      <p className="text-sm text-text">Delete this {config.noun}? This cannot be undone.</p>
                      <div className="flex gap-2">
                        <Button variant="danger" onClick={() => remove(record)} disabled={isBusy}>
                          Yes, delete
                        </Button>
                        <Button variant="ghost" onClick={() => setConfirmId(null)} disabled={isBusy}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <Button variant="secondary" className="min-h-9 px-4 py-1.5" onClick={() => openEdit(record)}>
                        Edit
                      </Button>
                      {config.publishable && (
                        <Button variant="ghost" className="min-h-9 px-4 py-1.5" onClick={() => togglePublished(record)} disabled={isBusy}>
                          {record.isPublished ? 'Hide' : 'Publish'}
                        </Button>
                      )}
                      <Button variant="ghost" className={cn('min-h-9 px-4 py-1.5 text-error hover:bg-error/5')} onClick={() => setConfirmId(record.id)}>
                        Delete
                      </Button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </>
      )}
    </AdminPage>
  )
}

function Badge({ children }: { children: string }) {
  return <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-semibold text-text-muted">{children}</span>
}

function StatusBadge({ published }: { published: boolean }) {
  return published ? (
    <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">Published</span>
  ) : (
    <span className="rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-semibold text-warning">Draft</span>
  )
}

function FieldInput({
  field,
  value,
  onChange,
  id,
}: {
  field: FieldConfig
  value: string | boolean | undefined
  onChange: (v: string | boolean) => void
  id: string
}) {
  const text = typeof value === 'string' ? value : ''
  const label = (
    <label htmlFor={id} className="field-label">
      {field.label}
      {field.required && <span className="text-error" aria-hidden> *</span>}
    </label>
  )
  const help = field.help && <p className="field-help">{field.help}</p>

  switch (field.kind) {
    case 'checkbox':
      return (
        <div className="flex items-start gap-3 rounded-md border border-border bg-surface-muted px-4 py-3">
          <input
            id={id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="mt-0.5 h-5 w-5 accent-primary-600"
          />
          <div>
            <label htmlFor={id} className="text-sm font-medium text-text">
              {field.label}
            </label>
            {help}
          </div>
        </div>
      )
    case 'textarea':
      return (
        <>
          {label}
          <textarea id={id} rows={5} className="field-input" value={text} onChange={(e) => onChange(e.target.value)} maxLength={field.maxLength} required={field.required} />
          {help}
        </>
      )
    case 'select': {
      const options = (field.options ?? []).map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
      return (
        <>
          {label}
          <select id={id} className="field-input" value={text} onChange={(e) => onChange(e.target.value)}>
            <option value="">Not set</option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {help}
        </>
      )
    }
    case 'image':
      return <ImageField id={id} label={field.label} value={text} onChange={(v) => onChange(v)} help={field.help} />
    default: {
      const type =
        field.kind === 'number' ? 'number' : field.kind === 'date' || field.kind === 'date-optional' ? 'date' : field.kind === 'datetime' ? 'datetime-local' : field.kind === 'time' ? 'time' : field.kind === 'url' ? 'url' : field.kind === 'email' ? 'email' : 'text'
      return (
        <>
          {label}
          <input
            id={id}
            type={type}
            className="field-input"
            value={text}
            onChange={(e) => onChange(e.target.value)}
            maxLength={field.maxLength}
            required={field.required}
            min={field.kind === 'number' ? 0 : undefined}
            inputMode={field.kind === 'number' ? 'numeric' : undefined}
          />
          {help}
        </>
      )
    }
  }
}

function messageOf(err: unknown): string {
  if (err instanceof ApiClientError) return err.message
  if (err instanceof Error) return err.message
  return 'Something went wrong. Please try again.'
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
