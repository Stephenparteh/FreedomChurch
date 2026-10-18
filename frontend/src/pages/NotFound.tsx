import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { usePageMeta } from '@/hooks/usePageMeta'

export function NotFound() {
  usePageMeta('Page not found')

  return (
    <section className="flex min-h-[70vh] items-center py-24">
      <Container className="max-w-2xl">
        <p className="eyebrow">Error 404</p>
        <h1 className="display-lg mt-4 text-text">This page could not be found.</h1>
        <span aria-hidden className="hairline mt-8 block" />
        <p className="mt-6 text-lg text-text-muted">
          The page may have moved, or the address may be mistyped.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button to="/">Back to home</Button>
          <Button to="/sermons" variant="secondary">
            Browse sermons
          </Button>
        </div>
      </Container>
    </section>
  )
}
