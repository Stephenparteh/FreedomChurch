import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";
import { useSiteSettings } from "@/hooks/useSiteSettings";

/**
 * "Give in Person" is always shown first — it only needs the church's address, already
 * confirmed in site settings. Every other method (Orange Money, Mobile Money, Bank
 * Transfer, ...) comes from the admin-managed givingMethods list; none are invented.
 * Previously this listed fabricated Orange Money/Mobile Money/bank account numbers —
 * those are gone. Until the church enters real methods, a contact fallback is shown
 * instead of inventing details.
 */
export function WaysToGive() {
  const { address, email, phone, givingMethods } = useSiteSettings();

  return (
    <section className="bg-surface py-20 sm:py-28 lg:py-16">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          {/* Intro */}
          <Reveal className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <h2 className="mt-6 max-w-md font-display text-5xl font-semibold leading-[0.98] tracking-tight text-primary-900 sm:text-6xl lg:text-7xl">
                Give in a way that works for you.
              </h2>

              <p className="mt-7 max-w-md text-base leading-relaxed text-text-muted sm:text-lg">
                Your generosity helps support the work of NFPC. Choose the
                giving method that is most convenient for you.
              </p>
            </div>
          </Reveal>

          {/* Giving methods */}
          <div className="lg:col-span-7">
            <div>
              <Reveal>
                <article className="group border-b border-border py-8 first:pt-0 last:border-b-0 sm:py-10 lg:py-12">
                  <div className="grid gap-6 sm:grid-cols-[72px_1fr] sm:gap-8">
                    <div>
                      <span className="font-display text-lg font-semibold text-accent-500">01</span>
                    </div>
                    <div>
                      <h3 className="font-display text-3xl font-semibold leading-tight tracking-tight text-primary-900 sm:text-4xl">
                        Give in Person
                      </h3>
                      <p className="mt-4 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
                        Give during any of our services and connect with the church community in person.
                      </p>
                      {address && <p className="mt-5 text-sm font-medium text-primary-900">{address}</p>}
                    </div>
                  </div>
                </article>
              </Reveal>

              {givingMethods.map((method, index) => (
                <Reveal key={method.title} delay={Math.min(index + 1, 4) * 80}>
                  <article className="group border-b border-border py-8 last:border-b-0 sm:py-10 lg:py-12">
                    <div className="grid gap-6 sm:grid-cols-[72px_1fr] sm:gap-8">
                      <div>
                        <span className="font-display text-lg font-semibold text-accent-500">
                          {String(index + 2).padStart(2, "0")}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display text-3xl font-semibold leading-tight tracking-tight text-primary-900 sm:text-4xl">
                          {method.title}
                        </h3>
                        {method.instructions && (
                          <p className="mt-4 max-w-xl whitespace-pre-line text-base leading-relaxed text-text-muted sm:text-lg">
                            {method.instructions}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}

              {givingMethods.length === 0 && (email || phone) && (
                <Reveal delay={80}>
                  <article className="border-b border-border py-8 last:border-b-0 sm:py-10 lg:py-12">
                    <div className="grid gap-6 sm:grid-cols-[72px_1fr] sm:gap-8">
                      <div>
                        <span className="font-display text-lg font-semibold text-accent-500">02</span>
                      </div>
                      <div>
                        <h3 className="font-display text-3xl font-semibold leading-tight tracking-tight text-primary-900 sm:text-4xl">
                          Other ways to give
                        </h3>
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
                          Contact the church directly and we&apos;ll help you find the most convenient way to give.
                        </p>
                        <p className="mt-5 text-sm font-medium text-primary-900">{[email, phone].filter(Boolean).join(" · ")}</p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
