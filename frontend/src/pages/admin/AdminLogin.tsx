import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/lib/auth/context'
import { usePageMeta } from '@/hooks/usePageMeta'
import { ApiClientError } from '@/lib/api/client'

export function AdminLogin() {
  usePageMeta('Admin sign in')
  const { status, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (status === 'authenticated') return <Navigate to={from} replace />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await login(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(
        err instanceof ApiClientError && err.code === 'INVALID_CREDENTIALS'
          ? 'That email and password did not match. Check them and try again.'
          : err instanceof ApiClientError
            ? err.message
            : 'Could not sign in. Check your connection and try again.',
      )
      setPassword('')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'mt-1 w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-primary-500'

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4 py-10">
      <Card className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-semibold text-text">NFPC Admin</h1>
        <p className="mt-2 text-sm text-text-muted">Sign in to manage the website.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          {error && (
            <p role="alert" className="rounded-md border border-error/30 bg-error/5 px-3 py-2 text-sm text-error">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-text">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-text">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              className={inputClass}
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
