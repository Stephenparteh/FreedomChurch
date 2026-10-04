import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export function SiteLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-elevated"
      >
        Skip to content
      </a>
      <Header />
      {/* The homepage hero sits behind the fixed header; every other page needs the offset. */}
      <main id="main-content" tabIndex={-1} className={isHome ? 'flex-1' : 'flex-1 pt-16 lg:pt-20'}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
