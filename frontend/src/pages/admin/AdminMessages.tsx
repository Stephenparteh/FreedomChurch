import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AdminPage } from '@/components/admin/AdminPage'
import { StateMessage } from '@/components/shared/StateMessage'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { usePageMeta } from '@/hooks/usePageMeta'
import { adminMessages, type AdminMessage } from '@/lib/api/admin'
import { ApiClientError } from '@/lib/api/client'
import { cn } from '@/lib/cn'

type Filter = 'all' | 'new' | 'read' | 'archived'
const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'Unread' },
  { value: 'read', label: 'Read' },
  { value: 'archived', label: 'Archived' },
]

function messageError(err: unknown) {
  return err instanceof ApiClientError || err instanceof Error ? err.message : 'Something went wrong.'
}

/** Contact-form inbox. Submissions are never shown on the website. */
export function AdminMessages() {
  usePageMeta('Admin messages')
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState<Filter>('all')
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [loadError, setLoadError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get('open'))
  const [actionError, setActionError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    setState('loading')
    adminMessages
      .list({ limit: 100, status: filter === 'all' ? undefined : filter })
      .then(({ data }) => {
        if (cancelled) return
        setMessages(data)
        setState('ready')
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setLoadError(messageError(err))
        setState('error')
      })
    return () => {
      cancelled = true
    }
  }, [filter, reloadKey])

  const selected = messages.find((m) => m.id === selectedId) ?? null

  function select(id: string) {
    setSelectedId(id)
    setConfirmDelete(false)
    setActionError('')
    setSearchParams({ open: id }, { replace: true })
  }

  async function setStatus(status: 'new' | 'read' | 'archived') {
    if (!selected) return
    setBusy(true)
    setActionError('')
    try {
      await adminMessages.setStatus(selected.id, status)
      setReloadKey((k) => k + 1)
    } catch (err) {
      setActionError(messageError(err))
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!selected) return
    setBusy(true)
    setActionError('')
    try {
      await adminMessages.remove(selected.id)
      setSelectedId(null)
      setConfirmDelete(false)
      setSearchParams({}, { replace: true })
      setReloadKey((k) => k + 1)
    } catch (err) {
      setActionError(messageError(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AdminPage title="Messages" description="Messages sent through the website contact form. They are private to the church.">
      <div role="tablist" aria-label="Filter messages" className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            role="tab"
            aria-selected={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm font-medium',
              filter === f.value ? 'border-primary-600 bg-primary-600 text-white' : 'border-border-strong text-text-muted hover:bg-surface-muted',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <section aria-label="Message list">
          {state === 'loading' && <StateMessage title="Loading messages..." />}
          {state === 'error' && <StateMessage tone="error" title="Could not load messages" description={loadError} />}
          {state === 'ready' && messages.length === 0 && (
            <StateMessage title="No messages here" description="Messages from the contact form will appear in this list." />
          )}
          {state === 'ready' && messages.length > 0 && (
            <ul className="space-y-2">
              {messages.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => select(m.id)}
                    aria-current={selectedId === m.id ? 'true' : undefined}
                    className={cn(
                      'w-full rounded-md border px-4 py-3 text-left hover:bg-surface-muted',
                      selectedId === m.id ? 'border-primary-400 bg-primary-50' : 'border-border bg-surface',
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {m.status === 'new' && <span className="h-2 w-2 rounded-full bg-primary-600" aria-hidden />}
                      <span className={cn('truncate text-text', m.status === 'new' ? 'font-semibold' : 'font-medium')}>{m.name}</span>
                      <span className="sr-only">{m.status === 'new' ? '(unread)' : ''}</span>
                    </span>
                    <span className="mt-1 block truncate text-sm text-text-muted">{m.subject || m.message}</span>
                    <span className="mt-1 block text-xs text-text-muted">{formatWhen(m.createdAt)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-label="Message details">
          {!selected && state === 'ready' && messages.length > 0 && (
            <StateMessage title="Select a message" description="Choose a message on the left to read it." />
          )}
          {selected && (
            <Card>
              <dl className="grid gap-4 sm:grid-cols-2">
                <Detail label="From" value={selected.name} />
                <Detail label="Status" value={selected.status === 'new' ? 'Unread' : selected.status === 'read' ? 'Read' : 'Archived'} />
                <Detail
                  label="Email"
                  value={<a className="text-primary-600 underline" href={`mailto:${selected.email}`}>{selected.email}</a>}
                />
                <Detail label="Phone" value={selected.phone || 'Not given'} />
                <Detail label="Subject" value={selected.subject || 'No subject'} />
                <Detail label="Submitted" value={formatWhen(selected.createdAt)} />
              </dl>
              <div className="mt-6">
                <p className="text-sm font-medium text-text">Message</p>
                <p className="mt-2 whitespace-pre-wrap rounded-md bg-surface-muted p-4 text-sm text-text">{selected.message}</p>
              </div>

              {actionError && (
                <p role="alert" className="mt-4 text-sm text-error">
                  {actionError}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                {selected.status === 'new' ? (
                  <Button variant="secondary" onClick={() => setStatus('read')} disabled={busy}>
                    Mark as read
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={() => setStatus('new')} disabled={busy}>
                    Mark as unread
                  </Button>
                )}
                {selected.status !== 'archived' && (
                  <Button variant="ghost" onClick={() => setStatus('archived')} disabled={busy}>
                    Archive
                  </Button>
                )}
                {confirmDelete ? (
                  <span role="group" aria-label="Confirm delete" className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-text">Delete this message permanently?</span>
                    <Button variant="secondary" onClick={remove} disabled={busy}>
                      Yes, delete
                    </Button>
                    <Button variant="ghost" onClick={() => setConfirmDelete(false)} disabled={busy}>
                      Cancel
                    </Button>
                  </span>
                ) : (
                  <Button variant="ghost" onClick={() => setConfirmDelete(true)} disabled={busy}>
                    Delete
                  </Button>
                )}
              </div>
            </Card>
          )}
        </section>
      </div>
    </AdminPage>
  )
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</dt>
      <dd className="mt-1 break-words text-sm text-text">{value}</dd>
    </div>
  )
}

function formatWhen(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}
