import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/lib/cn'

const adminNav = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Sermons', to: '/admin/sermons' },
  { label: 'Events', to: '/admin/events' },
  { label: 'Gallery', to: '/admin/gallery' },
  { label: 'Ministries', to: '/admin/ministries' },
  { label: 'Announcements', to: '/admin/announcements' },
  { label: 'Settings', to: '/admin/settings' },
]

/**
 * Structural shell only. Real authentication/authorization guards this
 * route tree starting Milestone 4 (see docs/DASHBOARD_PLAN.md) — nothing
 * here is protected yet.
 */
export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-surface-muted">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-surface p-6 sm:block">
        <p className="font-display text-lg font-semibold text-text">NFPC Admin</p>
        <nav className="mt-8 space-y-1" aria-label="Admin">
          {adminNav.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'block rounded-md px-3 py-2 text-sm font-medium text-text-muted hover:bg-surface-muted',
                  isActive && 'bg-primary-50 text-primary-600',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 p-6 sm:p-10">
        <Outlet />
      </div>
    </div>
  )
}
