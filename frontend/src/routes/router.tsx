import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RequireAuth } from '@/components/admin/RequireAuth'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { About } from '@/pages/About'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminLogin } from '@/pages/admin/AdminLogin'
import { AdminMessages } from '@/pages/admin/AdminMessages'
import { AdminSettings } from '@/pages/admin/AdminSettings'
import {
  AdminAnnouncements,
  AdminEvents,
  AdminGallery,
  AdminMinistries,
  AdminSermons,
  AdminServiceSessions,
  AdminTeam,
} from '@/pages/admin/CmsPages'
import { Contact } from '@/pages/Contact'
import { Events } from '@/pages/Events'
import { Gallery } from '@/pages/Gallery'
import { Give } from '@/pages/Give'
import { Home } from '@/pages/Home'
import { Ministries } from '@/pages/Ministries'
import { NotFound } from '@/pages/NotFound'
import { Sermons } from '@/pages/Sermons'

export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/ministries', element: <Ministries /> },
      { path: '/sermons', element: <Sermons /> },
      { path: '/events', element: <Events /> },
      { path: '/gallery', element: <Gallery /> },
      { path: '/give', element: <Give /> },
      { path: '/contact', element: <Contact /> },
    ],
  },
  { path: '/admin/login', element: <AdminLogin /> },
  { path: '/admin/dashboard', element: <Navigate to="/admin" replace /> },
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'messages', element: <AdminMessages /> },
      { path: 'sermons', element: <AdminSermons /> },
      { path: 'events', element: <AdminEvents /> },
      { path: 'gallery', element: <AdminGallery /> },
      { path: 'ministries', element: <AdminMinistries /> },
      { path: 'service-sessions', element: <AdminServiceSessions /> },
      { path: 'announcements', element: <AdminAnnouncements /> },
      { path: 'team', element: <AdminTeam /> },
      { path: 'settings', element: <AdminSettings /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])
