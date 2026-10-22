import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const worshipPhoto = "/photos/congregation-worship.webp";

export function AboutPreview() {
  const { aboutDescription } = useSiteSettings();

  return (
    <section className="bg-surface py-10 sm:py-28 lg:py-12">
      <Container>
        <Reveal className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
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
            

            <h2 className="mt-5 max-w-lg font-display text-4xl font-semibold leading-[1.08] tracking-tight text-primary-900 sm:text-5xl">
              About National Freedom Pentecostal Church
            </h2>

            {aboutDescription && (
              <p className="mt-7 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg">
                {aboutDescription}
              </p>
            )}

            <div className="mt-9">
              <Button to="/about" variant="primary">
                Learn More
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
