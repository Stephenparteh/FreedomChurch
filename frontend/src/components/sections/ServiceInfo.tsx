import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/shared/Reveal'
import { serviceTimes, siteConfig } from '@/data/site'

export function ServiceInfo() {
  return (
    <Section tone="muted">
      <Reveal>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
            Join us
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-text sm:text-4xl">
            When &amp; where we gather
          </h2>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {serviceTimes.map((service, index) => (
          <Reveal key={service.label} delay={index * 100}>
            <Card className="h-full">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                {service.day}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-text">{service.label}</h3>
              <p className="mt-1 text-text-muted">{service.time}</p>
            </Card>
          </Reveal>
        ))}
        <Reveal delay={serviceTimes.length * 100}>
          <Card className="h-full">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              Location
            </p>
            <h3 className="mt-2 text-lg font-semibold text-text">Where to find us</h3>
            <p className="mt-1 text-text-muted">{siteConfig.address}</p>
          </Card>
        </Reveal>
      </div>
    </Section>
  )
}
