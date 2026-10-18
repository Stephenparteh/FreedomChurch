import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import nfpcCrest from '@/assets/brand/nfpc-crest-transparent.png'
import { useAuth } from '@/lib/auth/context'
import { cn } from '@/lib/cn'

interface NavItem {
  label: string
  to: string
  end?: boolean
}

interface NavGroup {
  heading: string | null
  items: NavItem[]
}

/** Grouped by how the church uses the CMS: publish content, read messages, change settings. */
const adminNav: NavGroup[] = [
  { heading: null, items: [{ label: 'Overview', to: '/admin', end: true }] },
  {
    heading: 'Content',
    items: [
      { label: 'Sermons', to: '/admin/sermons' },
      { label: 'Events', to: '/admin/events' },
      { label: 'Announcements', to: '/admin/announcements' },
      { label: 'Ministries', to: '/admin/ministries' },
      { label: 'Gallery', to: '/admin/gallery' },
      { label: 'Leadership', to: '/admin/team' },
      { label: 'Branches', to: '/admin/branches' },
      { label: 'Service sessions', to: '/admin/service-sessions' },
    ],
  },
  { heading: 'Communication', items: [{ label: 'Messages', to: '/admin/messages' }] },
  { heading: 'Settings', items: [{ label: 'Site settings', to: '/admin/settings' }] },
]

/** Admin shell: a fixed sidebar on large screens and a top bar with a full-height sheet on small ones. */
export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  const nav = (
    <nav aria-label="Admin" className="space-y-7">
      {adminNav.map((group) => (
        <div key={group.heading ?? 'root'}>
          {group.heading && <p className="eyebrow mb-2 px-3 text-[0.65rem] text-text-muted">{group.heading}</p>}
          <ul className="space-y-0.5">
            {group.items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'relative flex min-h-10 items-center rounded-md px-3 text-sm font-medium text-text-muted transition-colors hover:bg-surface-muted hover:text-text',
                      isActive &&
                        "bg-primary-50 text-primary-800 before:absolute before:inset-y-2 before:-left-px before:w-0.5 before:rounded-full before:bg-gold-500 before:content-['']",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-surface-muted lg:flex">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <img src={nfpcCrest} alt="" className="h-9 w-9 object-contain" />
          <p className="font-display text-lg font-semibold leading-none text-text">NFPC Admin</p>
        </div>
        <button
          type="button"
          className="inline-flex min-h-11 items-center rounded-md border border-border-strong px-4 text-sm font-semibold text-text hover:bg-surface-muted"
          aria-expanded={menuOpen}
          aria-controls="admin-mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </header>

      {menuOpen && (
        <div
          id="admin-mobile-nav"
          className="fixed inset-x-0 bottom-0 top-[57px] z-30 flex flex-col overflow-y-auto bg-surface px-4 py-6 lg:hidden"
        >
          {nav}
          <AccountBlock email={user?.email} onLogout={handleLogout} />
        </div>
      )}

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col overflow-y-auto border-r border-border bg-surface px-5 py-8 lg:flex">
        <div className="flex items-center gap-3 px-3">
          <img src={nfpcCrest} alt="" className="h-11 w-11 object-contain" />
          <div>
            <p className="font-display text-xl font-semibold leading-none text-text">NFPC</p>
            <p className="mt-1 text-xs text-text-muted">Content management</p>
          </div>
        </div>
        <div className="mt-10 flex-1">{nav}</div>
        <AccountBlock email={user?.email} onLogout={handleLogout} />
      </aside>

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
        <Outlet />
      </main>
    </div>
  )
}

function AccountBlock({ email, onLogout }: { email?: string; onLogout: () => void }) {
  return (
    <div className="mt-8 border-t border-border pt-5">
      {email && (
        <div className="mb-3 px-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-text-muted">Signed in</p>
          <p className="mt-1 truncate text-sm text-text">{email}</p>
        </div>
      )}
      <button
        type="button"
        onClick={onLogout}
        className="inline-flex min-h-10 w-full items-center justify-center rounded-md border border-border-strong px-3 text-sm font-semibold text-text hover:border-primary-300 hover:bg-surface-muted"
      >
        Sign out
      </button>
    </div>
  )
}
