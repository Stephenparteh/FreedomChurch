import { useState } from 'react'
import { Container } from '@/components/ui/Container'

type Belief = {
  title: string
  body: string
  image: string
}

const SAMPLE_BELIEFS: Belief[] = [
  {
    title: 'Faith',
    body: 'A life centered on trust in God and His Word.',
    image: '/photos/congregation-worship.webp',
  },
  {
    title: 'Worship',
    body: 'A community committed to honoring God together.',
    image: '/photos/congregation-service.webp',
  },
  {
    title: 'Community',
    body: 'A church where people grow through fellowship and service.',
    image: '/photos/congregation-worship.webp',
  },
  {
    title: 'Purpose',
    body: 'A life that reflects faith through action.',
    image: '/photos/congregation-service.webp',
  },
]

/** 4. What We Believe — interactive editorial belief selector. */
export function Beliefs() {
  const [activeIndex, setActiveIndex] = useState(0)

  const activeBelief = SAMPLE_BELIEFS[activeIndex]

  return (
    <section className="bg-surface py-24 sm:py-32 lg:py-36">
      <Container>
        {/* Heading */}
        <div className="max-w-3xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-500">
            <span
              aria-hidden="true"
              className="h-px w-10 bg-accent-500"
            />
            What we believe
          </p>

          <h2 className="mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-tight text-primary-900 sm:text-6xl lg:text-7xl">
            What guides us.
          </h2>
        </div>

        {/* Belief navigation */}
        <div className="mt-14 border-y border-border sm:mt-16 lg:mt-20">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {SAMPLE_BELIEFS.map((belief, index) => {
              const isActive = index === activeIndex

              return (
                <button
                  key={belief.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isActive}
                  className={`relative border-b border-border px-4 py-6 text-left transition-colors duration-300 sm:border-b-0 sm:px-5 lg:px-6 ${
                    index < SAMPLE_BELIEFS.length - 1
                      ? 'sm:border-r'
                      : ''
                  } ${
                    isActive
                      ? 'bg-primary-900 text-white'
                      : 'bg-transparent text-primary-900 hover:bg-surface-muted'
                  }`}
                >
                  <span
                    className={`block text-xs font-semibold tracking-[0.16em] ${
                      isActive
                        ? 'text-accent-500'
                        : 'text-accent-500'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="mt-3 block font-display text-xl font-semibold sm:text-2xl">
                    {belief.title}
                  </span>

                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-0 h-1 transition-all duration-300 ${
                      isActive
                        ? 'w-full bg-accent-500'
                        : 'w-0 bg-accent-500'
                    }`}
                  />
                </button>
              )
            })}
          </div>
        </div>

        {/* Active belief */}
        <div className="mt-12 grid items-center gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-16 lg:mt-20">
          {/* Image */}
          <div className="overflow-hidden rounded-md bg-primary-900 lg:col-span-7">
            <div className="aspect-[16/9]">
              <img
                key={activeBelief.image}
                src={activeBelief.image}
                alt=""
                className="h-full w-full object-cover transition-opacity duration-500"
                loading="lazy"
              />
            </div>
          </div>

          {/* Content */}
          <div
            key={activeBelief.title}
            className="lg:col-span-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">
              {String(activeIndex + 1).padStart(2, '0')}
            </p>

            <h3 className="mt-4 font-display text-4xl font-semibold leading-[1] tracking-tight text-primary-900 sm:text-5xl lg:text-6xl">
              {activeBelief.title}
            </h3>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-text-muted sm:text-xl">
              {activeBelief.body}
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}