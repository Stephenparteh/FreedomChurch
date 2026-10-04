import nfpcLogo from '@/assets/brand/nfpc-logo.png'
import { Container } from '@/components/ui/Container'
import { primaryNav, siteConfig } from '@/data/site'
import { useServiceSessions, formatSessionTime } from '@/hooks/useServiceSessions'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export function Footer() {
  const { churchName, motto, email, phone, address, footerNote } = useSiteSettings()
  const { sessions } = useServiceSessions()

  return (
    <footer className="border-t border-border bg-surface-inverted text-text-inverted">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <img src={nfpcLogo} alt="" className="h-9 w-9" />
            <p className="font-display text-lg font-semibold">{siteConfig.shortName}</p>
          </div>
          <p className="mt-3 max-w-xs text-sm text-text-inverted/70">{churchName}</p>
          {motto && (
            <p className="mt-1 text-sm italic text-text-inverted/50">&ldquo;{motto}&rdquo;</p>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-inverted/60">
            Explore
          </h2>
          <ul className="mt-4 space-y-2">
            {primaryNav.map((link) => (
              <li key={link.to}>
                <a href={link.to} className="text-sm text-text-inverted/80 hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-inverted/60">
            Service times
          </h2>
          {sessions.length === 0 ? (
            <p className="mt-4 text-sm text-text-inverted/60">Coming soon.</p>
          ) : (
            <ul className="mt-4 space-y-2 text-sm text-text-inverted/80">
              {sessions.map((session) => (
                <li key={session.id}>
                  <span className="block text-text-inverted">{session.name}</span>
                  <span className="text-text-inverted/60">
                    {session.dayOfWeek} &middot; {formatSessionTime(session)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-inverted/60">
            Contact
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-text-inverted/80">
            <li>{email}</li>
            <li>{phone}</li>
            <li>{address}</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-text-inverted/60 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {churchName}. All rights reserved.
          </p>
          {footerNote ? <p>{footerNote}</p> : <p>Built by the NFPC team.</p>}
        </Container>
      </div>
    </footer>
  )
}
