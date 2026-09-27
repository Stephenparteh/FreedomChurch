import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { About } from '@/pages/About'
import { AdminComingSoon } from '@/pages/admin/AdminComingSoon'
import { AdminLogin } from '@/pages/admin/AdminLogin'
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
  { path: '/admin', element: <Navigate to="/admin/dashboard" replace /> },
  { path: '/admin/login', element: <AdminLogin /> },
  {
    element: <AdminLayout />,
    children: [
      { path: '/admin/dashboard', element: <AdminComingSoon /> },
      { path: '/admin/sermons', element: <AdminComingSoon /> },
      { path: '/admin/events', element: <AdminComingSoon /> },
      { path: '/admin/gallery', element: <AdminComingSoon /> },
      { path: '/admin/ministries', element: <AdminComingSoon /> },
      { path: '/admin/announcements', element: <AdminComingSoon /> },
      { path: '/admin/settings', element: <AdminComingSoon /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])
