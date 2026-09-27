import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/shared/PageHero'
import { placeholderMinistries } from '@/data/placeholders'
import { usePageMeta } from '@/hooks/usePageMeta'

export function Ministries() {
  usePageMeta('Ministries', 'Explore the ministries you can join or support at NFPC.')

  return (
    <>
      <PageHero
        eyebrow="Get involved"
        title="Our ministries"
        description="Explore the various ministries you can join or support. Content below is placeholder — will be managed from the admin dashboard in a later milestone."
      />

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeholderMinistries.map((ministry) => (
            <Card key={ministry.id} className="flex flex-col">
              <div className="h-40 rounded-md bg-surface-muted" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold text-text">{ministry.name}</h3>
              <p className="mt-2 flex-1 text-sm text-text-muted">{ministry.description}</p>
              <Button variant="link" className="mt-4 self-start">
                Learn more &rarr;
              </Button>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}
