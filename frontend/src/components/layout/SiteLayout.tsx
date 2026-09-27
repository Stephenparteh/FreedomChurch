import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export function SiteLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* The homepage hero sits behind the fixed header; every other page needs the offset. */}
      <main className={isHome ? 'flex-1' : 'flex-1 pt-16 lg:pt-20'}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
