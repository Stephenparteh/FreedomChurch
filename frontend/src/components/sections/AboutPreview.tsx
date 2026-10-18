import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const worshipPhoto = "/photos/congregation-worship.webp";

export function AboutPreview() {
  const { description } = useSiteSettings();

  return (
    <section className="bg-surface py-10 sm:py-28 lg:py-12">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
          {/* Image */}
          <div className="overflow-hidden rounded-sm">
            <img
              src={worshipPhoto}
              alt="The NFPC congregation gathered in worship"
              className="h-auto max-h-[520px] w-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="max-w-xl">
            <p className="flex items-center gap-3 text-s font-semibold uppercase tracking-[0.22em] text-accent-500">
              {/* <span aria-hidden="true" className="h-px w-8 bg-accent-500" /> */}
              About us
            </p>

            <h2 className="mt-5 max-w-lg font-display text-4xl font-semibold leading-[1.08] tracking-tight text-primary-900 sm:text-5xl">
              About National Freedom Pentecostal Church
            </h2>

            {description && (
              <p className="mt-7 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg">
                {description}
              </p>
            )}

            <div className="mt-9">
              <Button to="/about" variant="primary">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
