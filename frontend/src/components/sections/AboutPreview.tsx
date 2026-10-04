import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/shared/Reveal'

const congregationPhoto = '/photos/congregation-worship.webp'

export function AboutPreview() {
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
            About us
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-text sm:text-4xl">
            Who we are as a church
          </h2>
          <p className="mt-4 text-text-muted">
            TODO_CONFIRM_ABOUT_SUMMARY
          </p>
          <div className="mt-6">
            <Button to="/about" variant="link">
              Read more about us &rarr;
            </Button>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="aspect-[4/3] overflow-hidden rounded-xl">
            <img
              src={congregationPhoto}
              alt="The NFPC congregation gathered in worship"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
