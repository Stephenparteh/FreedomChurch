import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth/context'
import { cn } from '@/lib/cn'

const adminNav = [
  { label: 'Dashboard', to: '/admin', end: true },
  { label: 'Messages', to: '/admin/messages' },
  { label: 'Sermons', to: '/admin/sermons' },
  { label: 'Events', to: '/admin/events' },
  { label: 'Gallery', to: '/admin/gallery' },
  { label: 'Ministries', to: '/admin/ministries' },
  { label: 'Service sessions', to: '/admin/service-sessions' },
  { label: 'Announcements', to: '/admin/announcements' },
  { label: 'Team', to: '/admin/team' },
  { label: 'Settings', to: '/admin/settings' },
]

/** Admin shell: sidebar on large screens, a collapsible menu on small ones. */
export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  const nav = (
    <nav aria-label="Admin" className="space-y-1">
      {adminNav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={() => setMenuOpen(false)}
          className={({ isActive }) =>
            cn(
              'block rounded-md px-3 py-2 text-sm font-medium text-text-muted hover:bg-surface-muted',
              isActive && 'bg-primary-50 text-primary-700',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-surface-muted lg:flex">
      <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
        <p className="font-display text-lg font-semibold text-text">NFPC Admin</p>
        <button
          type="button"
          className="rounded-md border border-border-strong px-3 py-1.5 text-sm font-medium"
          aria-expanded={menuOpen}
          aria-controls="admin-mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? 'Close menu' : 'Menu'}
        </button>
      </header>

      {menuOpen && (
        <div id="admin-mobile-nav" className="border-b border-border bg-surface p-4 lg:hidden">
          {nav}
          <LogoutButton onLogout={handleLogout} email={user?.email} />
        </div>
      )}

      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface p-6 lg:flex">
        <p className="font-display text-lg font-semibold text-text">NFPC Admin</p>
        <div className="mt-8 flex-1">{nav}</div>
        <LogoutButton onLogout={handleLogout} email={user?.email} />
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  )
}

function LogoutButton({ onLogout, email }: { onLogout: () => void; email?: string }) {
  return (
    <div className="mt-6 border-t border-border pt-4">
      {email && <p className="mb-2 truncate text-xs text-text-muted">Signed in as {email}</p>}
      <button
        type="button"
        onClick={onLogout}
        className="w-full rounded-md border border-border-strong px-3 py-2 text-sm font-medium text-text hover:bg-surface-muted"
      >
        Sign out
      </button>
    </div>
  )
}
