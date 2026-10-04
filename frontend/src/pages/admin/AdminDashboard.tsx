import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminPage } from '@/components/admin/AdminPage'
import { Card } from '@/components/ui/Card'
import { usePageMeta } from '@/hooks/usePageMeta'
import { adminMessages, adminResource, type AdminMessage } from '@/lib/api/admin'

type Counts = Record<string, number | null>

const sections = [
  { key: 'messages', label: 'Unread messages', to: '/admin/messages' },
  { key: 'sermons', label: 'Sermons', to: '/admin/sermons' },
  { key: 'events', label: 'Events', to: '/admin/events' },
  { key: 'gallery', label: 'Gallery photos', to: '/admin/gallery' },
  { key: 'ministries', label: 'Ministries', to: '/admin/ministries' },
  { key: 'service-sessions', label: 'Service & Bible study sessions', to: '/admin/service-sessions' },
  { key: 'announcements', label: 'Announcements', to: '/admin/announcements' },
  { key: 'leadership', label: 'Team & leadership', to: '/admin/team' },
] as const

/** Dashboard: counts that come from the same API the dashboard edits, plus recent messages. */
export function AdminDashboard() {
  usePageMeta('Admin dashboard')
  const [counts, setCounts] = useState<Counts>({})
  const [recent, setRecent] = useState<AdminMessage[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const entries = await Promise.all(
          sections.map(async (s) => {
            const res =
              s.key === 'messages'
                ? await adminMessages.list({ status: 'new', limit: 1 })
                : await adminResource(s.key).list({ limit: 1 })
            return [s.key, res.pagination?.total ?? 0] as const
          }),
        )
        const recentRes = await adminMessages.list({ limit: 5 })
        if (cancelled) return
        setCounts(Object.fromEntries(entries))
        setRecent(recentRes.data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load the dashboard.')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AdminPage title="Dashboard" description="Overview of what is on the website and what needs attention.">
      {error && (
        <p role="alert" className="mb-6 rounded-md border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
          {error}
        </p>
      )}

      <section aria-labelledby="counts-heading">
        <h2 id="counts-heading" className="sr-only">
          Content overview
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {sections.map((s) => (
            <li key={s.key}>
              <Link to={s.to} className="block h-full rounded-lg focus-visible:outline-2 focus-visible:outline-primary-500">
                <Card className="h-full p-5 transition hover:border-primary-300">
                  <p className="text-sm text-text-muted">{s.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-text">
                    {counts[s.key] === undefined ? '...' : counts[s.key]}
                  </p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="recent-heading" className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="recent-heading" className="text-lg font-semibold text-text">
            Recent messages
          </h2>
          <Link to="/admin/messages" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>
        {recent === null && !error && <p className="text-sm text-text-muted">Loading messages...</p>}
        {recent && recent.length === 0 && <p className="text-sm text-text-muted">No messages yet.</p>}
        {recent && recent.length > 0 && (
          <ul className="space-y-2">
            {recent.map((m) => (
              <li key={m.id}>
                <Link to={`/admin/messages?open=${m.id}`} className="block rounded-md border border-border bg-surface px-4 py-3 hover:bg-surface-muted">
                  <span className="font-medium text-text">{m.name}</span>
                  {m.status === 'new' && <span className="ml-2 text-xs font-semibold text-primary-600">Unread</span>}
                  <span className="block truncate text-sm text-text-muted">{m.subject || m.message}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminPage>
  )
}
