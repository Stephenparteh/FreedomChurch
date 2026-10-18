import { Container } from "@/components/ui/Container";
import { useApi } from "@/hooks/useApi";
import { getLeadership } from "@/lib/api/resources";
import { resolveMediaUrl } from "@/lib/media";

const PASTOR_ROLE_PATTERN = /pastor|founder/i;

/**
 * A focused introduction to the church's pastor or founder — not a second Leadership
 * list. The person is identified from the existing leadership data by role (first
 * published member whose role mentions "pastor" or "founder"), never guessed or
 * invented. Sits directly above the full Leadership section below, which it
 * intentionally doesn't duplicate.
 *
 * When no such record is published yet, this shows a visibly labeled placeholder
 * (not a real name, not hidden) so the section's presence and layout can be judged
 * before real leadership data exists. The moment a real pastor/founder record is
 * published in the dashboard, it replaces the placeholder automatically.
 */
export function MeetThePastor() {
  const state = useApi(() => getLeadership(), []);
  if (state.status !== "success") return null;

  const pastor = state.data.find((member) => PASTOR_ROLE_PATTERN.test(member.role));

  return pastor ? <PastorCard pastor={pastor} /> : <PastorPlaceholder />;
}

function PastorCard({ pastor }: { pastor: { name: string; role: string; bio?: string; image?: string } }) {
  const image = resolveMediaUrl(pastor.image);

  return (
    <section className="bg-surface-muted py-20 sm:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="aspect-[4/5] overflow-hidden rounded-md bg-primary-900">
              {image ? (
                <img src={image} alt={pastor.name} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div aria-hidden className="flex h-full items-center justify-center">
                  <span className="font-display text-7xl font-semibold text-white/15">{pastor.name.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-8">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-500">
              <span aria-hidden className="h-px w-8 bg-accent-500" />
              Meet {pastor.role.toLowerCase().includes("founder") ? "the Founder" : "the Pastor"}
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-primary-900 sm:text-4xl">
              {pastor.name}
            </h2>
            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-accent-500">{pastor.role}</p>
            {pastor.bio && <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">{pastor.bio}</p>}
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Visibly a placeholder — never mistakable for a real person. */
function PastorPlaceholder() {
  return (
    <section className="bg-surface-muted py-20 sm:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-border-strong bg-surface">
              <span aria-hidden className="font-display text-7xl font-semibold text-text-muted/20">?</span>
            </div>
          </div>

          <div className="lg:col-span-8">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-500">
              <span aria-hidden className="h-px w-8 bg-accent-500" />
              Meet the Pastor
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-primary-900 sm:text-4xl">
              [PLACEHOLDER] Sample Placeholder — Replace This
            </h2>
            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-accent-500">
              Add this leader in the dashboard
            </p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
              This is a placeholder for demonstration only — not a real person. Publish a leadership record with
              "Pastor" or "Founder" in the role field, and it will appear here automatically.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
