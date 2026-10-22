import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";
import {
  formatSessionTime,
  PLATFORM_LABEL,
  useServiceSessions,
} from "@/hooks/useServiceSessions";
import { useSiteSettings } from "@/hooks/useSiteSettings";

/**
 * ServiceInfo
 *
 * Dark editorial service section with a strong typographic
 * schedule. No service cards or images — the typography,
 * spacing, and dividers create the visual structure.
 */
export function ServiceInfo() {
  const { address } = useSiteSettings();
  const { sessions, isLoading, isError } = useServiceSessions();

  if (isLoading || isError || (sessions.length === 0 && !address)) {
    return null;
  }

  return (
    <section
      aria-labelledby="service-info-heading"
      className="bg-primary-900 py-20 text-white sm:py-24 lg:py-28"
    >
      <Container>
        <Reveal className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-20">
          {/* Intro */}
          <div className="max-w-lg">
            {/* <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">
              Plan your visit
            </p> */}

            <h2
              id="service-info-heading"
              className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Worship with us.
            </h2>

            <p className="mt-6 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
              There is a place for you at NFPC. Join us as we gather together
              for worship, fellowship, and the Word of God.
            </p>

            {/* {address && (
              <div className="mt-10 border-white/15 pt-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-500">
                  Find us
                </p>

                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
                  {address}
                </p>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center text-sm font-semibold text-white underline decoration-accent-500 decoration-2 underline-offset-4 transition-opacity hover:opacity-70"
                >
                  Get directions
                </a>
              </div>
            )} */}
          </div>

          {/* Services */}
          {sessions.length > 0 && (
            <div>
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="grid gap-3 border-b border-white/20 py-7 sm:grid-cols-[0.8fr_1.4fr_auto] sm:items-center sm:gap-8"
                >
                  {/* Day */}
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-500">
                    {session.dayOfWeek}
                  </p>

                  {/* Service information */}
                  <div>
                    <p className="font-display text-2xl font-semibold text-white sm:text-3xl">
                      {session.name}
                    </p>

                    <p className="mt-1 text-sm text-white/50">
                      {PLATFORM_LABEL[session.platform]}
                    </p>
                  </div>

                  {/* Time */}
                  <p className="font-display text-lg font-semibold text-white sm:text-xl sm:text-right">
                    {formatSessionTime(session)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
