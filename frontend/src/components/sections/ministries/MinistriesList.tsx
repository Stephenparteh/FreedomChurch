import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";
import { useApi } from "@/hooks/useApi";
import { getMinistries } from "@/lib/api/resources";
import { visibleText } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";
import { Link } from "react-router-dom";

/**
 * Full ministries listing.
 *
 * NFPC visual palette:
 * - Deep navy for structure and fallback surfaces
 * - Red for accents and interactive states
 * - White for light text
 * - No gold
 *
 * Each ministry gets an editorial image-and-text row.
 * The layout alternates between image-left/text-right and
 * text-left/image-right.
 *
 * Ministries do not have separate detail pages. The CTA directs
 * visitors to the contact page so they can get involved.
 */
export function MinistriesList() {
  const state = useApi(() => getMinistries(), []);

  if (state.status !== "success" || state.data.length === 0) {
    return null;
  }

  return (
    <section className="bg-surface pb-24 sm:pb-32 lg:py-26">
      <Container>
        <div className="space-y-20 sm:space-y-28 lg:space-y-16">
          {state.data.map((ministry, index) => {
            const description = visibleText(ministry.shortDescription);
            const meetingInfo = visibleText(ministry.meetingInfo);
            const contactInfo = visibleText(ministry.contactInfo);
            const image = resolveMediaUrl(ministry.image);
            const imageFirst = index % 2 === 1;

            return (
              <Reveal key={ministry.id} delay={Math.min(index, 4) * 80}>
              <article className="group">
                <div
                  className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${
                    imageFirst
                      ? "lg:[&>*:first-child]:order-2"
                      : ""
                  }`}
                >
                  {/* Image */}
                  <div className="overflow-hidden rounded-md bg-primary-900">
                    <div className="aspect-[4/3]">
                      {image ? (
                        <img
                          src={image}
                          alt={ministry.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary-900 px-8 text-center">
                          <span className="font-display text-5xl font-semibold text-white/15 sm:text-6xl">
                            {ministry.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Text */}
                  <div
                    className={`max-w-xl ${
                      imageFirst ? "lg:order-1" : ""
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">
                      Ministry {String(index + 1).padStart(2, "0")}
                    </p>

                    <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-primary-900 sm:text-5xl lg:text-6xl">
                      {ministry.name}
                    </h2>

                    {description && (
                      <p className="mt-6 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg">
                        {description}
                      </p>
                    )}

                    {(meetingInfo || contactInfo) && (
                      <dl className="mt-6 space-y-2 border-l-2 border-accent-500 pl-5 text-sm text-text-muted">
                        {meetingInfo && (
                          <div>
                            <dt className="inline font-semibold text-primary-900">When it meets: </dt>
                            <dd className="inline">{meetingInfo}</dd>
                          </div>
                        )}
                        {contactInfo && (
                          <div>
                            <dt className="inline font-semibold text-primary-900">Contact: </dt>
                            <dd className="inline">{contactInfo}</dd>
                          </div>
                        )}
                      </dl>
                    )}

                    <Link
                      to="/contact"
                      className="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-primary-900 transition-colors hover:text-accent-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-4"
                    >
                      Get involved

                      <span
                        aria-hidden="true"
                        className="text-lg text-accent-500 transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}