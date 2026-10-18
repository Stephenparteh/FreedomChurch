import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import nfpcCrest from "@/assets/brand/nfpc-crest-transparent.png";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/context";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ApiClientError } from "@/lib/api/client";

const congregationPhoto = "/photos/congregation-service.webp";

export function AdminLogin() {
  usePageMeta("Admin sign in");

  const { status, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (status === "authenticated") {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiClientError && err.code === "INVALID_CREDENTIALS"
          ? "That email and password did not match. Check them and try again."
          : err instanceof ApiClientError
            ? err.message
            : "Could not sign in. Check your connection and try again.",
      );

      setPassword("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-12">
      {/* Image panel */}
      <aside className="relative isolate hidden overflow-hidden bg-primary-900 text-white lg:col-span-6 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <img
          src={congregationPhoto}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-primary-900/70"
        />

        {/* Church identity */}
        <div className="flex items-center gap-4">
          <img
            src={nfpcCrest}
            alt="NFPC crest"
            className="h-14 w-14 shrink-0 object-contain"
          />

          <div>
            <p className="font-display text-2xl font-semibold tracking-tight text-white">
              National Freedom <br /> Pentecostal Church
            </p>
            {/* <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/65">
              National Freedom Pentecostal Church
            </p> */}
          </div>
        </div>

        {/* Editorial message */}
        <div className="relative max-w-xl pb-4">
          <h2 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white xl:text-6xl">
            Keep the website current for the people it serves.
          </h2>
        </div>

        <p className="text-xs tracking-wide text-white/50">
          National Freedom Pentecostal Church
        </p>
      </aside>

      {/* Login panel */}
      <main className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10 lg:col-span-6 lg:px-12 xl:px-20">
        <div className="w-full max-w-md">
          {/* Mobile-only church identity */}
          <div className="mb-14 flex items-center gap-3 lg:hidden">
            <img
              src={nfpcCrest}
              alt="NFPC crest"
              className="h-12 w-12 shrink-0 object-contain"
            />

            <div>
              <p className="font-display text-xl font-semibold tracking-tight text-primary-900">
                NFPC
              </p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-text-muted">
                Church administration
              </p>
            </div>
          </div>

          <div className="mb-10">
            <h1 className="font-display text-5xl font-semibold leading-[0.98] tracking-tight text-primary-900 sm:text-6xl">
              Sign in
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {error && (
              <p
                role="alert"
                aria-live="polite"
                className="border-l-2 border-error pl-4 py-1 text-sm leading-6 text-error"
              >
                {error}
              </p>
            )}

            {/* Email */}
            <div>
              <label htmlFor="admin-email" className="field-label">
                Email address
              </label>

              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={submitting}
                className="mt-2 w-full border-0 border-b border-border bg-transparent px-0 py-3 text-base text-primary-900 outline-none transition-colors placeholder:text-text-muted/60 focus:border-accent-500 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className="field-label">
                Password
              </label>

              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={submitting}
                className="mt-2 w-full border-0 border-b border-border bg-transparent px-0 py-3 text-base text-primary-900 outline-none transition-colors placeholder:text-text-muted/60 focus:border-accent-500 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
