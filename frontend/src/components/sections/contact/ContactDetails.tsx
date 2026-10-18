import type { ReactNode } from "react";

interface ContactDetailsProps {
  email: string;
  phone: string;
  address: string;
}

export function ContactDetails({ email, phone, address }: ContactDetailsProps) {
  const hasDetails = Boolean(email || phone || address);

  if (!hasDetails) return null;

  return (
    <div>
      <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-500">
        {/* <span aria-hidden="true" className="h-px w-8 bg-accent-500" /> */}
        Reach us
      </p>

      <div className="mt-7 border-y border-border">
        {email && (
          <DetailRow
            label="Email"
            value={
              <a
                href={`mailto:${email}`}
                className="break-words text-primary-900 transition-colors hover:text-accent-500"
              >
                {email}
              </a>
            }
          />
        )}

        {phone && <DetailRow label="Phone" value={phone} />}

        {address && <DetailRow label="Address" value={address} />}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-2 border-b border-border py-5 last:border-b-0 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-5">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
        {label}
      </dt>

      <dd className="break-words text-sm leading-relaxed text-text">{value}</dd>
    </div>
  );
}
