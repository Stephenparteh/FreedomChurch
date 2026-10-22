import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";

const TOPICS = [
  {
    number: "01",
    title: "Who we are",
    body: "NFPC is a Pentecostal church community gathered around worship, prayer, and the teaching of Scripture.",
  },
  {
    number: "02",
    title: "What we do",
    body: "Through regular services, ministry activities, and community outreach, we seek to serve our congregation and wider community.",
  },
  {
    number: "03",
    title: "Our community",
    body: "We welcome people to worship with us, grow in faith, and build meaningful connections within the church family.",
  },
];

export function MoreAboutChurch() {
  return (
    <section className="bg-surface-muted py-20 sm:py-24 lg:py-20">
      <Container>
        <Reveal className="max-w-3xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary-700">
            <span aria-hidden="true" className="h-px w-8 bg-primary-700" />
            More about our church
          </p>

          <h2 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-primary-900 sm:text-5xl lg:text-6xl">
            Getting to know NFPC.
          </h2>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
            Discover the heart of our church, our activities, and the community
            we share through faith.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-9 sm:mt-14 sm:grid-cols-3 sm:gap-0">
          {TOPICS.map((topic, index) => (
            <Reveal
              key={topic.title}
              delay={index * 80}
              className={[
                "min-w-0",
                index > 0
                  ? "border-t border-primary-900/15 pt-8 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0 lg:pl-10"
                  : "",
                index < TOPICS.length - 1 ? "sm:pr-7 lg:pr-10" : "",
              ].join(" ")}
            >
              <span className="text-xs font-semibold tracking-[0.18em] text-primary-700">
                {topic.number}
              </span>

              <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-primary-900 sm:text-2xl">
                {topic.title}
              </h3>

              <p className="mt-3 max-w-sm text-base leading-7 text-text-muted">
                {topic.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
