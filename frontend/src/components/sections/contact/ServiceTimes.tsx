const DESIGN_SERVICE_TIMES = [
  {
    day: "Sunday",
    name: "Sunday Worship Service",
    time: "10:00 AM – 12:30 PM",
  },
  {
    day: "Tuesday",
    name: "Bible Study",
    time: "6:00 PM – 8:00 PM",
  },
  {
    day: "Thursday",
    name: "Prayer Meeting",
    time: "6:00 PM – 8:00 PM",
  },
];

export function ServiceTimes() {
  return (
    <div>
      <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-500">
        {/* <span aria-hidden="true" className="h-px w-8 bg-accent-500" /> */}
        Service times
      </p>

      <div className="mt-7 border-y border-border">
        {DESIGN_SERVICE_TIMES.map((service) => (
          <div
            key={service.day}
            className="grid gap-2 border-b border-border py-5 last:border-b-0 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
              {service.day}
            </p>

            <div>
              <p className="font-display text-lg font-semibold leading-tight text-primary-900">
                {service.name}
              </p>

              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                {service.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
