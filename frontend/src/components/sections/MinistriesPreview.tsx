import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/shared/Reveal'
import { placeholderMinistries } from '@/data/placeholders'

export function MinistriesPreview() {
  return (
    <Section tone="muted">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              Get involved
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-text sm:text-4xl">Our ministries</h2>
          </div>
          <Button to="/ministries" variant="link">
            View all ministries &rarr;
          </Button>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {placeholderMinistries.map((ministry, index) => (
          <Reveal key={ministry.id} delay={index * 100}>
            <Card interactive className="h-full">
              <h3 className="text-lg font-semibold text-text">{ministry.name}</h3>
              <p className="mt-2 text-sm text-text-muted">{ministry.summary}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
