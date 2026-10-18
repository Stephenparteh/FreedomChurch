import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-elevated"
      >
        Skip to content
      </a>
      <Header />
      {/* The fixed white header is 4rem (mobile) or 6rem (desktop). Every page, including the homepage, starts below it. */}
      <main id="main-content" tabIndex={-1} className="flex-1 pt-16 lg:pt-24">
        <Outlet />
      </main>
      <Footer />
      {/* Router-level scroll restoration: new navigations start at the top, back/forward
          restores the previous position, and hash links still land on their target. */}
      <ScrollRestoration />
    </div>
  )
}
