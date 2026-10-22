import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/shared/Reveal";

export function GivingRequestCTA() {
  const handleStartGiving = () => {
    document.getElementById("giving-request")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="bg-primary-900 py-20 text-white sm:py-24 lg:py-16">
      <Container>
        <Reveal className="grid items-end gap-10 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-8">
      
            <h2 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Ready to give?
            </h2>

            <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Tell us what you&apos;d like to give and how you&apos;d prefer to
              make your gift. Our team will contact you with the next steps.
            </p>
          </div>

          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <Button
              type="button"
              variant="light"
              onClick={handleStartGiving}
              className="w-full px-7 sm:w-auto"
            >
              Start a giving request
              {/* <span aria-hidden="true" className="ml-2">
                →
              </span> */}
            </Button>
          </div>
        </Reveal>

        {/* <div className="mt-14 h-px w-full bg-white/10 sm:mt-16" /> */}

        {/* <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
          Giving requests are followed up by the NFPC team
        </p> */}
      </Container>
    </section>
  );
}
