import { useEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";

const worshipPhoto = "/photos/congregation-worship.webp";

export function AboutHero() {
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

      const currentSection = sectionRef.current;
      const currentImage = imageRef.current;

      if (!currentSection || !currentImage) return;

      const rect = currentSection.getBoundingClientRect();
      const travel = Math.min(Math.max(-rect.top, 0), rect.height);

      currentImage.style.transform = `translate3d(0, ${-travel * 0.12}px, 0)`;
    }

    function onScroll() {
      if (frame === 0) {
        frame = requestAnimationFrame(update);
      }
    }

    function sync() {
      const currentImage = imageRef.current;

      if (!currentImage) return;

      if (reduceMotion.matches) {
        window.removeEventListener("scroll", onScroll);
        currentImage.style.transform = "";
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

      if (frame !== 0) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[75svh] items-center overflow-hidden bg-primary-900 text-white"
    >
      <img
        ref={imageRef}
        src={worshipPhoto}
        alt="The NFPC congregation gathered in worship"
        className="absolute inset-x-0 top-0 -z-20 h-[115%] w-full object-cover object-center will-change-transform"
        fetchPriority="high"
      />

      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/50" />

      <Container className="relative py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="mx-auto max-w-2xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Who we are.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
            NFPC is a church family built around worship, community, and a
            shared commitment to growing in faith together.
          </p>
        </div>
      </Container>
    </section>
  );
}
