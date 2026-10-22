import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";

// Temporary static content — update when the official details are available.
const pastor = {
  name: "Apostle Alexander George",
  role: "Senior Pastor",
  bio: "With a heart for serving God and His people, our pastor is committed to preaching the Gospel of Jesus Christ, teaching the Word of God, and encouraging believers to grow in faith. Through prayer, spiritual guidance, and dedicated service, he seeks to help people experience the freedom found in Jesus Christ.",
  image: "/images/pastor.jpeg",
};

export function MeetThePastor() {
  return (
    <section className="overflow-hidden bg-surface-muted py-16 sm:py-20 lg:py-24">
      <Container>
        <Reveal className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Pastor introduction */}
          <div className="order-2 lg:order-1">
            <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-primary-900 sm:text-5xl lg:text-6xl">
              Meet Our Shepard.
            </h2>

            <div className="mt-8">
              <h3 className="font-display text-2xl font-semibold tracking-tight text-primary-900 sm:text-3xl">
                {pastor.name}
              </h3>

              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-700 sm:text-sm">
                {pastor.role}
              </p>
            </div>

            <p className="mt-6 max-w-xl text-base leading-8 text-text-muted sm:text-lg">
              {pastor.bio}
            </p>

            <div aria-hidden="true" className="mt-8 h-1 w-16 bg-primary-700" />
          </div>

          {/* Pastor portrait */}
          <div className="order-1 lg:order-2">
            <div className="relative mx-auto max-w-md lg:ml-auto lg:mr-0">
              <div
                aria-hidden="true"
                className="absolute -right-3 -top-3 h-full w-full border border-primary-700/25 sm:-right-4 sm:-top-4"
              />

              <div className="relative aspect-[4/5] overflow-hidden bg-primary-900">
                <img
                  src={pastor.image}
                  alt={`Portrait of ${pastor.name}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
