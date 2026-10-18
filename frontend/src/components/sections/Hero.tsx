import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const congregationPhoto = "/photos/congregation-service.webp";

/**
 * Full-width photograph with centered text. The photo moves slightly slower than the
 * page (a subtle parallax), and that movement is off for visitors who prefer reduced
 * motion. The image is 115% of the section height and moves up by at most 12% of it,
 * so the bottom edge always stays covered and no gap can open.
 */
export function Hero() {
  const { motto, churchName, description } = useSiteSettings();
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    if (!section || !image) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    function update() {
      frame = 0;
      if (!section || !image) return;
      const rect = section.getBoundingClientRect();
      // How far the section has scrolled above the viewport, capped to its own height.
      const travel = Math.min(Math.max(-rect.top, 0), rect.height);
      image.style.transform = `translate3d(0, ${-travel * 0.12}px, 0)`;
    }

    function onScroll() {
      if (frame === 0) frame = requestAnimationFrame(update);
    }

    function sync() {
      if (reduceMotion.matches) {
        window.removeEventListener("scroll", onScroll);
        if (image) image.style.transform = "";
      } else {
        window.addEventListener("scroll", onScroll, { passive: true });
        update();
      }
    }

    sync();
    reduceMotion.addEventListener("change", sync);

    return () => {
      reduceMotion.removeEventListener("change", sync);
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[90svh] items-center overflow-hidden bg-primary-900 text-white"
    >
      <img
        ref={imageRef}
        src={congregationPhoto}
        alt="The NFPC congregation gathered for a service"
        className="absolute inset-x-0 top-0 -z-20 h-[115%] w-full object-cover object-center will-change-transform"
        fetchPriority="high"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/50" />

      <Container className="relative py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white sm:text-base">
            {churchName}
          </p>

          <h1 className="mx-auto mt-6 max-w-2xl text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {motto || "Welcome"}
          </h1>

          {description && (
            <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
              {description}
            </p>
          )}

          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button to="/contact" variant="light" className="px-7">
              Plan your visit
            </Button>
            <Button to="/sermons" variant="accent" className="px-7">
              Listen to sermons
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
