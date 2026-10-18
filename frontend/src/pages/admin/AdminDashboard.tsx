import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminPage } from "@/components/admin/AdminPage";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  adminMessages,
  adminResource,
  type AdminMessage,
} from "@/lib/api/admin";

type Counts = Record<string, number | null>;

const contentSections = [
  { key: "sermons", label: "Sermons", to: "/admin/sermons" },
  { key: "events", label: "Events", to: "/admin/events" },
  { key: "announcements", label: "Announcements", to: "/admin/announcements" },
  { key: "ministries", label: "Ministries", to: "/admin/ministries" },
  { key: "gallery", label: "Gallery photos", to: "/admin/gallery" },
  { key: "leadership", label: "Leadership", to: "/admin/team" },
  {
    key: "service-sessions",
    label: "Service sessions",
    to: "/admin/service-sessions",
  },
] as const;

/** Counts come from the same API the CMS edits. Nothing here is estimated or invented. */
export function AdminDashboard() {
  usePageMeta("Admin overview");

  const [counts, setCounts] = useState<Counts>({});
  const [unread, setUnread] = useState<number | null>(null);
  const [recent, setRecent] = useState<AdminMessage[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const entries = await Promise.all(
          contentSections.map(async (section) => {
            const res = await adminResource(section.key).list({ limit: 1 });
            return [section.key, res.pagination?.total ?? 0] as const;
          }),
        );

        const unreadRes = await adminMessages.list({ status: "new", limit: 1 });
        const recentRes = await adminMessages.list({ limit: 5 });

        if (cancelled) return;

        setCounts(Object.fromEntries(entries));
        setUnread(unreadRes.pagination?.total ?? 0);
        setRecent(recentRes.data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load the overview.",
          );
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminPage
      title="Overview"
      description="A snapshot of your website content and the messages that need your attention."
    >
      {error && (
        <p
          role="alert"
          className="mb-8 border-l-2 border-error bg-error/5 px-4 py-3 text-sm leading-6 text-error"
        >
          {error}
        </p>
      )}

      {/* Content overview */}
      <section aria-labelledby="content-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Website management</p>
            <h2
              id="content-heading"
              className="mt-2 font-display text-2xl font-semibold tracking-tight text-text sm:text-3xl"
            >
              Your content
            </h2>
          </div>

          <p className="text-xs text-text-muted">Live totals from the CMS</p>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {contentSections.map((section) => (
            <li key={section.key}>
              <Link
                to={section.to}
                className="group flex min-h-36 flex-col justify-between border border-border bg-surface p-5 transition-colors hover:border-primary-400 hover:bg-primary-50/40 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-500 sm:min-h-40 sm:p-6"
              >
                <span className="text-sm font-medium leading-5 text-text-muted transition-colors group-hover:text-primary-800">
                  {section.label}
                </span>

                <span className="flex items-end justify-between gap-3">
                  <span className="font-display text-4xl font-semibold leading-none tracking-tight text-text sm:text-5xl">
                    {counts[section.key] === undefined ? (
                      <span className="text-text-muted/50">&hellip;</span>
                    ) : (
                      counts[section.key]
                    )}
                  </span>

                  <span
                    aria-hidden="true"
                    className="mb-1 text-lg text-text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary-700"
                  >
                    &rarr;
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Inbox overview */}
      <section
        aria-labelledby="inbox-heading"
        className="mt-12 border border-border bg-surface sm:mt-14"
      >
        <Link
          to="/admin/messages"
          className="group flex flex-col gap-5 p-5 transition-colors hover:bg-primary-50/30 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-500 sm:flex-row sm:items-center sm:justify-between sm:p-7"
        >
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center border border-border font-display text-xl text-primary-700"
            >
              @
            </span>

            <div>
              <p className="eyebrow">Correspondence</p>
              <h2
                id="inbox-heading"
                className="mt-1 font-display text-xl font-semibold tracking-tight text-text sm:text-2xl"
              >
                Message inbox
              </h2>
              <p className="mt-1 text-sm leading-6 text-text-muted">
                Review questions and messages sent to the church.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-5 border-t border-border pt-4 sm:border-0 sm:pt-0">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Unread messages
              </p>
              <p className="mt-1 font-display text-4xl font-semibold leading-none tracking-tight text-text">
                {unread ?? <span className="text-text-muted/50">&hellip;</span>}
              </p>
            </div>

            <span className="text-xl text-primary-700 transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </div>
        </Link>
      </section>

      {/* Recent messages */}
      <section aria-labelledby="recent-heading" className="mt-14 sm:mt-16">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="eyebrow">Latest activity</p>
            <h2
              id="recent-heading"
              className="mt-2 font-display text-2xl font-semibold tracking-tight text-text sm:text-3xl"
            >
              Recent messages
            </h2>
          </div>

          <Link
            to="/admin/messages"
            className="inline-flex items-center gap-2 pb-1 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-900"
          >
            View all
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {recent === null && !error && (
          <p className="py-8 text-sm text-text-muted">Loading messages...</p>
        )}

        {recent && recent.length === 0 && (
          <p className="py-8 text-sm text-text-muted">No messages yet.</p>
        )}

        {recent && recent.length > 0 && (
          <ul className="divide-y divide-border">
            {recent.map((message) => (
              <li key={message.id}>
                <Link
                  to={`/admin/messages?open=${message.id}`}
                  className="group grid gap-2 py-5 transition-colors hover:bg-primary-50/30 sm:grid-cols-[minmax(9rem,0.8fr)_minmax(0,2fr)_auto] sm:items-center sm:gap-6 sm:px-4"
                >
                  <span className="font-semibold text-text transition-colors group-hover:text-primary-800">
                    {message.name}
                  </span>

                  <span className="min-w-0 truncate text-sm leading-6 text-text-muted group-hover:text-text">
                    {message.subject || message.message}
                  </span>

                  <span className="flex items-center justify-between gap-4">
                    {message.status === "new" ? (
                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary-700">
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-accent-500"
                        />
                        Unread
                      </span>
                    ) : (
                      <span className="text-xs text-text-muted">Received</span>
                    )}

                    <span
                      aria-hidden="true"
                      className="text-text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary-700"
                    >
                      &rarr;
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminPage>
  );
}
