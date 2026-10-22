import { formatSessionTime, useServiceSessions } from "@/hooks/useServiceSessions";

export function ServiceTimes() {
  const { sessions } = useServiceSessions();

  if (sessions.length === 0) return null;

  return (
    <div>
      <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-500">
        {/* <span aria-hidden="true" className="h-px w-8 bg-accent-500" /> */}
        Service times
      </p>

      <div className="mt-7 border-y border-border">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="grid gap-2 border-b border-border py-5 last:border-b-0 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
              {session.dayOfWeek}
            </p>

            <div>
              <p className="font-display text-lg font-semibold leading-tight text-primary-900">
                {session.name}
              </p>

              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                {formatSessionTime(session)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
