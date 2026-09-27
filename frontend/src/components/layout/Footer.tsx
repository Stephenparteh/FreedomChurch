import { Container } from '@/components/ui/Container'
import { primaryNav, siteConfig } from '@/data/site'

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-inverted text-text-inverted">
      <Container className="grid gap-10 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold">{siteConfig.name}</p>
          <p className="mt-3 max-w-xs text-sm text-text-inverted/70">
            A place of worship and community.
          </p>
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
            Contact
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-text-inverted/80">
            <li>{siteConfig.email}</li>
            <li>{siteConfig.phone}</li>
            <li>{siteConfig.address}</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="text-center text-xs text-text-inverted/60">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </Container>
      </div>
    </footer>
  )
}
