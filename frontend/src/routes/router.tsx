import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdminPage } from './AdminPage'
import { RequireAuth } from '@/components/admin/RequireAuth'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { About } from '@/pages/About'
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
  { path: '/admin/login', element: <AdminPage page="login" /> },
  { path: '/admin/dashboard', element: <Navigate to="/admin" replace /> },
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <AdminPage page="dashboard" /> },
      { path: 'messages', element: <AdminPage page="messages" /> },
      { path: 'sermons', element: <AdminPage page="sermons" /> },
      { path: 'events', element: <AdminPage page="events" /> },
      { path: 'gallery', element: <AdminPage page="gallery" /> },
      { path: 'ministries', element: <AdminPage page="ministries" /> },
      { path: 'service-sessions', element: <AdminPage page="service-sessions" /> },
      { path: 'announcements', element: <AdminPage page="announcements" /> },
      { path: 'team', element: <AdminPage page="team" /> },
      { path: 'settings', element: <AdminPage page="settings" /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])
