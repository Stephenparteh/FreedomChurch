import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";
import { useApi } from "@/hooks/useApi";
import { getLeadership } from "@/lib/api/resources";
import { resolveMediaUrl } from "@/lib/media";
import type { LeadershipMember } from "@/types/content";

/**
 * 5. Leadership — equal three-column editorial portrait layout.
 *
 * Reconnected to the real CMS (getLeadership(), sorted by displayOrder server-side).
 * Renders nothing while loading, on error, or when no leaders are published yet —
 * same "stay quiet rather than show a broken section" behavior as the rest of the
 * approved homepage/page sections (see EventsList, MinistriesList, SermonsPreview).
 */
export function Leadership() {
  const state = useApi(() => getLeadership(), []);

  if (state.status !== "success" || state.data.length === 0) {
    return null;
  }

  return (
    <section className="bg-surface py-24 sm:py-32 lg:py-16">
      <Container>
        {/* Heading */}
        <Reveal className="max-w-3xl">

          <h2 className="mt-5 font-display text-5xl font-semibold leading-[0.98] tracking-tight text-primary-900 sm:text-6xl lg:text-7xl">
            People serving the church.
          </h2>

        </Reveal>

        {/* Leadership */}
        <div className="mt-16 sm:mt-10">
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-20">
            {state.data.map((leader, index) => (
              <Reveal key={leader.id} delay={index * 80}>
                <LeaderItem leader={leader} />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function LeaderItem({ leader }: { leader: LeadershipMember }) {
  return (
    <article>
      {/* Portrait */}
      <div className="overflow-hidden rounded-md bg-primary-900">
        <div className="aspect-[3/4]">
          <LeaderPortrait name={leader.name} image={leader.image} />
        </div>
      </div>

      {/* Information */}
      <div className="mt-6">
        <h3 className="font-display text-3xl font-semibold leading-[1.02] tracking-tight text-primary-900 sm:text-4xl">
          {leader.name}
        </h3>

        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent-500">
          {leader.role}
        </p>

        {leader.bio && (
          <p className="mt-5 max-w-lg text-base leading-relaxed text-text-muted">
            {leader.bio}
          </p>
        )}
      </div>
    </article>
  );
}

function LeaderPortrait({ name, image }: { name: string; image?: string }) {
  const photo = resolveMediaUrl(image);

  if (photo) {
    return <img src={photo} alt={name} className="h-full w-full object-cover" loading="lazy" />;
  }

  return (
    <div aria-hidden="true" className="flex h-full items-center justify-center">
      <span className="font-display text-[7rem] font-semibold leading-none text-white/15 sm:text-[8rem]">
        {name.charAt(0)}
      </span>
    </div>
  );
}
