import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Closing CTA:
 * A strong final invitation before the footer.
 *
 * Keeps the section simple and typographic, with NFPC's deep blue
 * background and red accent. No repeated photography or invented claims.
 */
export function CTASection() {
  return (
    <section className="bg-primary-900 text-white">
      <Container className="py-24 sm:py-32 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          {/* Statement */}
          <div className="lg:col-span-8">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-500">
              <span aria-hidden="true" className="h-px w-8 bg-accent-500" />
              Your next step
            </p>

            <h2 className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-8xl">
              Come as you are.
            </h2>

            <p className="mt-7 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
              Whether you are visiting for the first time or looking for a
              church community, we would love to hear from you.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 lg:col-span-4 lg:justify-end">
            <Button to="/contact" variant="light" className="px-7">
              Contact us
            </Button>

            <Button
              to="/events"
              variant="secondary"
              className="border-white/30 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white"
            >
              See upcoming events
            </Button>
          </div>
        </div>

        {/* Closing accent */}
        {/* <div
          aria-hidden="true"
          className="mt-16 h-1 w-16 bg-accent-500 sm:mt-20"
        /> */}
      </Container>
    </section>
  );
}
