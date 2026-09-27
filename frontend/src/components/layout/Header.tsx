import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import nfpcLogo from '@/assets/brand/nfpc-logo.png'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { primaryNav, siteConfig } from '@/data/site'
import { useScrolled } from '@/hooks/useScrolled'
import { cn } from '@/lib/cn'

export function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const scrolled = useScrolled(40)
  const solid = !isHome || scrolled || open

  // Close the mobile panel on route change, without an effect (React's
  // documented pattern for resetting state in response to a prop change).
  const [lastPathname, setLastPathname] = useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {open && (
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}
      <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        solid
          ? 'border-b border-border bg-surface/95 backdrop-blur'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <Container className="flex h-16 items-center justify-between lg:h-20">
        <NavLink to="/" className="flex items-center gap-2.5">
          <img src={nfpcLogo} alt="" className="h-9 w-9 lg:h-11 lg:w-11" />
          <span
            className={cn(
              'font-display text-lg font-semibold tracking-tight transition-colors',
              solid ? 'text-text' : 'text-white',
            )}
          >
            {siteConfig.shortName}
          </span>
        </NavLink>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {primaryNav.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium transition-colors',
                  solid ? 'text-text-muted hover:text-primary-600' : 'text-white/85 hover:text-white',
                  isActive && (solid ? 'text-primary-600' : 'text-white'),
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button to="/give" variant="primary">
            Give
          </Button>
        </div>

        <button
          type="button"
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-md lg:hidden',
            solid ? 'text-text' : 'text-white',
          )}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span aria-hidden className="text-2xl leading-none">
            {open ? '✕' : '☰'}
          </span>
        </button>
      </Container>

      <nav
        id="mobile-nav"
        aria-label="Primary"
        className={cn(
          'overflow-hidden border-t border-border bg-surface transition-[max-height] duration-300 ease-out lg:hidden',
          open ? 'max-h-[28rem]' : 'max-h-0 border-t-0',
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {primaryNav.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2.5 text-sm font-medium text-text-muted hover:bg-surface-muted',
                  isActive && 'bg-primary-50 text-primary-600',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Button to="/give" variant="primary" className="mt-2 justify-center">
            Give
          </Button>
        </Container>
      </nav>
      </header>
    </>
  )
}
