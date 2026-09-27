import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/shared/Reveal'

export function CTASection() {
  return (
    <Section tone="inverted" className="text-center">
      <Reveal>
        <h2 className="text-3xl font-semibold sm:text-4xl">Get connected</h2>
        <p className="mx-auto mt-4 max-w-xl text-text-inverted/80">
          Whether it's your first visit or you've been part of our family for years, there's a
          place for you here.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button to="/contact" variant="secondary" className="bg-white text-primary-700">
            Contact us
          </Button>
          <Button to="/give" variant="primary">
            Give
          </Button>
        </div>
      </Reveal>
    </Section>
  )
}
