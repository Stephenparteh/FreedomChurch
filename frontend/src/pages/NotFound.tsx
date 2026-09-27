import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { usePageMeta } from '@/hooks/usePageMeta'

export function NotFound() {
  usePageMeta('Page not found')

  return (
    <Section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-text">Page not found</h1>
      <p className="mt-3 max-w-md text-text-muted">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <div className="mt-8">
        <Button to="/">Back to home</Button>
      </div>
    </Section>
  )
}
