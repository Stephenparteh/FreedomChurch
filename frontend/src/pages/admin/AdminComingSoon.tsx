import { useLocation } from 'react-router-dom'
import { StateMessage } from '@/components/shared/StateMessage'
import { usePageMeta } from '@/hooks/usePageMeta'

const sectionTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/sermons': 'Sermons',
  '/admin/events': 'Events',
  '/admin/gallery': 'Gallery',
  '/admin/ministries': 'Ministries',
  '/admin/announcements': 'Announcements',
  '/admin/settings': 'Settings',
}

/** Shared placeholder for every admin route until Milestone 4 builds the real dashboard. */
export function AdminComingSoon() {
  const { pathname } = useLocation()
  const title = sectionTitles[pathname] ?? 'Admin'
  usePageMeta(`Admin · ${title}`)

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text">{title}</h1>
      <StateMessage
        className="mt-6"
        title="This section is planned for Milestone 4"
        description="Content management for this area is documented in docs/DASHBOARD_PLAN.md and will be built alongside authentication and the backend API."
      />
    </div>
  )
}
