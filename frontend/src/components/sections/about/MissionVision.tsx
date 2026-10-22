import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";

type Purpose = "motto" | "mandate";

const content = {
  motto: {
    label: "Our Motto",
    title: "You Must Be Freed.",
    reference: "John 8:32, 36",
    description:
      "Our motto points to the freedom found in Jesus Christ and the truth of His Word.",
  },
  mandate: {
    label: "Our Mandate",
    title: "Proclaim the Gospel. Teach salvation. Pray for freedom.",
    reference: "Matthew 28:18–20",
    description:
      "Rooted in the Great Commission, our mandate is to preach the Gospel, teach the message of salvation, and pray for those seeking freedom from spiritual bondage.",
  },
};

export function MissionVision() {
  const [active, setActive] = useState<Purpose>("motto");

  const currentIndex = active === "motto" ? 0 : 1;
  const current = content[active];

  return (
    <section className="overflow-hidden bg-primary-900 py-20 text-white sm:py-24 lg:py-20">
      <Container>
        <Reveal className="mx-auto max-w-6xl">
          {/* Section heading */}
        
          {/* Motto and mandate navigation */}
          <div className="mx-auto mt-12 max-w-5xl sm:mt-16">
            <div className="relative">
              {/* Navigation track */}
              <div
                aria-hidden="true"
                className="absolute left-0 right-0 top-[calc(100%-8px)] h-px bg-white/20"
              />

              {/* Active progress */}
              <div
                aria-hidden="true"
                className="absolute left-0 top-[calc(100%-8px)] h-0.5 bg-accent-500 transition-all duration-500"
                style={{
                  width: currentIndex === 0 ? "0%" : "100%",
                }}
              />

              <div className="relative grid grid-cols-2">
                <button
                  type="button"
                  onClick={() => setActive("motto")}
                  className="group flex min-h-16 flex-col items-start gap-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  aria-pressed={active === "motto"}
                >
                  <span
                    className={`font-display text-lg font-semibold uppercase tracking-[0.06em] transition-colors duration-300 sm:text-2xl ${
                      active === "motto"
                        ? "text-white"
                        : "text-white/45 group-hover:text-white/80"
                    }`}
                  >
                    Our Motto
                  </span>

                  <span
                    aria-hidden="true"
                    className={`h-4 w-4 rounded-full border-2 transition-all duration-300 ${
                      active === "motto"
                        ? "border-accent-500 bg-accent-500 ring-4 ring-accent-500/20"
                        : "border-white/40 bg-primary-900"
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setActive("mandate")}
                  className="group flex min-h-16 flex-col items-end gap-4 text-right focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  aria-pressed={active === "mandate"}
                >
                  <span
                    className={`font-display text-lg font-semibold uppercase tracking-[0.06em] transition-colors duration-300 sm:text-2xl ${
                      active === "mandate"
                        ? "text-white"
                        : "text-white/45 group-hover:text-white/80"
                    }`}
                  >
                    Our Mandate
                  </span>

                  <span
                    aria-hidden="true"
                    className={`h-4 w-4 rounded-full border-2 transition-all duration-300 ${
                      active === "mandate"
                        ? "border-accent-500 bg-accent-500 ring-4 ring-accent-500/20"
                        : "border-white/40 bg-primary-900"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Active content */}
            <div className="mt-12 text-center sm:mt-16" aria-live="polite">
             

              <h3 className="mx-auto mt-5 max-w-4xl font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-6xl">
                {current.title}
              </h3>

              {/* <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
                {current.description}
              </p> */}

              <p className="mt-6 text-sm font-medium tracking-wide text-white/60">
                {current.reference}
              </p>
            </div>

            {/* Active indicator */}
            <div className="mt-10 flex justify-center gap-3" aria-hidden="true">
              <span
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  active === "motto" ? "w-10 bg-accent-500" : "w-2 bg-white/25"
                }`}
              />
              <span
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  active === "mandate"
                    ? "w-10 bg-accent-500"
                    : "w-2 bg-white/25"
                }`}
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
