import { lazy, Suspense } from 'react'
import { StateMessage } from '@/components/shared/StateMessage'

// Admin screens load on demand so public visitors never download the dashboard code.
const pages = {
  login: lazy(() => import('@/pages/admin/AdminLogin').then((m) => ({ default: m.AdminLogin }))),
  dashboard: lazy(() => import('@/pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))),
  messages: lazy(() => import('@/pages/admin/AdminMessages').then((m) => ({ default: m.AdminMessages }))),
  settings: lazy(() => import('@/pages/admin/AdminSettings').then((m) => ({ default: m.AdminSettings }))),
  sermons: lazy(() => import('@/pages/admin/CmsPages').then((m) => ({ default: m.AdminSermons }))),
  events: lazy(() => import('@/pages/admin/CmsPages').then((m) => ({ default: m.AdminEvents }))),
  gallery: lazy(() => import('@/pages/admin/CmsPages').then((m) => ({ default: m.AdminGallery }))),
  ministries: lazy(() => import('@/pages/admin/CmsPages').then((m) => ({ default: m.AdminMinistries }))),
  'service-sessions': lazy(() => import('@/pages/admin/CmsPages').then((m) => ({ default: m.AdminServiceSessions }))),
  announcements: lazy(() => import('@/pages/admin/CmsPages').then((m) => ({ default: m.AdminAnnouncements }))),
  team: lazy(() => import('@/pages/admin/CmsPages').then((m) => ({ default: m.AdminTeam }))),
}

export type AdminPageName = keyof typeof pages

export function AdminPage({ page }: { page: AdminPageName }) {
  const Page = pages[page]
  return (
    <Suspense fallback={<StateMessage title="Loading..." className="m-6" />}>
      <Page />
    </Suspense>
  )
}
