
import { Link } from "react-router-dom";
import nfpcCrest from "@/assets/brand/nfpc-crest-transparent.png";
import { Container } from "@/components/ui/Container";
import { primaryNav, siteConfig } from "@/data/site";
import {
  formatSessionTime,
  useServiceSessions,
} from "@/hooks/useServiceSessions";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "X",
};

/** Main NFPC footer — charcoal, red accent, and editorial layout. */
export function Footer() {
  const {
    churchName,
    motto,
    email,
    phone,
    address,
    footerNote,
    socials,
  } = useSiteSettings();

  const { sessions } = useServiceSessions();

  const socialEntries = Object.entries(socials).filter(
    ([, url]) => Boolean(url),
  );

  const contactLines = [email, phone, address].filter(Boolean);

  return (
    <footer className="bg-[#111111] text-white">
      <Container className="py-20 sm:py-24 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          {/* Church identity */}
          <div className="lg:col-span-5">
            <div className="flex items-start gap-5">
              <img
                src={nfpcCrest}
                alt={`${churchName} crest`}
                className="h-20 w-20 shrink-0 object-contain"
              />

              <div className="pt-1">
                <p className="font-display text-3xl font-semibold leading-none">
                  {siteConfig.shortName}
                </p>

                <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/55">
                  {churchName}
                </p>
              </div>
            </div>

            {motto && (
              <p className="mt-8 max-w-lg font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
                &ldquo;{motto}&rdquo;
              </p>
            )}

            {socialEntries.length > 0 && (
              <div className="mt-9">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">
                  Connect
                </p>

                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                  {socialEntries.map(([name, url]) => (
                    <li key={name}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
                      >
                        {SOCIAL_LABELS[name] ?? name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav
            aria-label="Footer navigation"
            className="lg:col-span-3"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">
              Explore
            </p>

            <ul className="mt-6 space-y-4">
              {primaryNav.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-medium text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services + contact */}
          <div className="lg:col-span-4">
            {sessions.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">
                  Service times
                </p>

                <ul className="mt-6 space-y-5">
                  {sessions.map((session) => (
                    <li key={session.id}>
                      <span className="block font-display text-lg font-semibold text-white">
                        {session.name}
                      </span>

                      <span className="mt-1 block text-sm text-white/55">
                        {session.dayOfWeek},{" "}
                        {formatSessionTime(session)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {contactLines.length > 0 && (
              <div className={sessions.length > 0 ? "mt-10" : ""}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">
                  Contact
                </p>

                <ul className="mt-6 space-y-3 text-sm text-white/65">
                  {contactLines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Closing accent */}
        <div
          aria-hidden="true"
          className="mt-20 h-1 w-16 bg-accent-500 sm:mt-24"
        />
      </Container>

      {/* Copyright */}
      <div className="bg-black/20">
        <Container className="flex flex-col gap-3 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {churchName}. All rights
            reserved.
          </p>

          {footerNote && <p>{footerNote}</p>}
        </Container>
      </div>
    </footer>
  );
}