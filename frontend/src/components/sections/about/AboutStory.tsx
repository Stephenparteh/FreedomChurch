import { Container } from "@/components/ui/Container";

const servicePhoto = "/photos/congregation-service.webp";

/** 2. Our Story — centered editorial heading with a compact image-and-story layout. */
export function AboutStory() {
  return (
    <section className="bg-surface py-24 sm:py-32 lg:py-16">
      <Container>
        {/* Section heading */}
        <div className="mx-auto max-w-6xl text-center">
          <p className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-500">
            {/* <span aria-hidden="true" className="h-px w-10 bg-accent-500" /> */}
            Our story
            {/* <span aria-hidden="true" className="h-px w-10 bg-accent-500" /> */}
          </p>

          <h2 className="mt-6 font-display text-4xl font-semibold leading-[1] tracking-tight text-primary-900 sm:text-5xl lg:whitespace-nowrap lg:text-6xl">
            A story of faith, people, and purpose.
          </h2>
        </div>

        {/* Story */}
        <div className="mx-auto mt-14 max-w-6xl sm:mt-16 lg:mt-12">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            {/* Image */}
            <div className="overflow-hidden rounded-md bg-primary-900">
              <div className="aspect-[5/3]">
                <img
                  src={servicePhoto}
                  alt="The NFPC congregation gathered for a service"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Story text */}
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-500">
                Faith, people &amp; purpose
              </p>

              <div className="mt-5 space-y-5 text-base leading-relaxed text-text-muted sm:text-lg">
                <p>
                  National Freedom Pentecostal Church exists to create a place
                  where people can encounter God, grow in faith, and walk
                  together in community.
                </p>

                <p>
                  What began with a commitment to faith and fellowship has
                  continued to grow through generations of worshippers,
                  families, leaders, and volunteers.
                </p>

                <p>
                  Today, NFPC remains focused on creating a welcoming church
                  community where people can discover purpose and grow together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
