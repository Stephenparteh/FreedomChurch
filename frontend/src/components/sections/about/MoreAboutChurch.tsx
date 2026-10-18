import { Container } from "@/components/ui/Container";

/**
 * "More About Our Church" — sits directly after Our Story, before Mission & Vision.
 *
 * TEMPORARY PLACEHOLDER CONTENT. Same status as AboutStory/MissionVision/Beliefs
 * elsewhere on this page: general, non-specific copy for layout purposes only. It
 * does not state any date, founder, historical event, location, achievement, or
 * doctrinal position — nothing here should be read as a confirmed church fact.
 * Replace every paragraph with the church's own words before launch.
 */
const TOPICS = [
  {
    title: "Who we are",
    body: "NFPC is a Pentecostal church community gathered around worship, prayer, and the teaching of Scripture.",
  },
  {
    title: "What we do",
    body: "Through regular services, ministry activities, and community outreach, we look to serve both our congregation and our wider community.",
  },
  {
    title: "Our community",
    body: "We are a church family that welcomes new members and encourages everyone to find a place to belong and grow.",
  },
];

export function MoreAboutChurch() {
  return (
    <section className="bg-surface-muted py-20 sm:py-28 lg:py-16">
      <Container>
        <div className="max-w-2xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-500">
            <span aria-hidden className="h-px w-8 bg-accent-500" />
            More about our church
          </p>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-primary-900 sm:text-5xl">
            Getting to know NFPC.
          </h2>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {TOPICS.map((topic) => (
            <div key={topic.title}>
              <h3 className="font-display text-xl font-semibold text-primary-900">{topic.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-text-muted">{topic.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
