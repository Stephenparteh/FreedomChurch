import { useState } from "react";
import { Container } from "@/components/ui/Container";

type Purpose = "mission" | "vision";

const content = {
  mission: {
    label: "Mission",
    title:
      "To help people encounter God, grow in faith, and live with purpose.",
    description:
      "Everything NFPC does is shaped by this: creating space for people to meet God, be formed in faith, and carry that faith into everyday life.",
  },
  vision: {
    label: "Vision",
    title:
      "To be a growing church community where faith, service, and transformation shape everyday life.",
    description:
      "We look forward to a church that keeps growing in depth and in reach, marked by people who serve one another and their city well.",
  },
};

export function MissionVision() {
  const [active, setActive] = useState<Purpose>("mission");

  const currentIndex = active === "mission" ? 0 : 1;

  return (
    <section className="overflow-hidden bg-primary-900 py-24 text-white sm:py-32 lg:py-12">
      <Container>
        <div className="mx-auto max-w-6xl">
          {/* Heading */}
          <div className="text-center">
            <h2 className="mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Why we exist.
            </h2>
          </div>

          {/* Journey navigation */}
          <div className="mx-auto mt-14 max-w-5xl sm:mt-16 lg:mt-10">
            <div className="relative">
              {/* Track */}
              <div
                aria-hidden="true"
                className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/20"
              />

              {/* Active progress */}
              <div
                aria-hidden="true"
                className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-accent-500 transition-all duration-500"
                style={{
                  width: currentIndex === 0 ? "0%" : "100%",
                }}
              />

              <div className="relative grid grid-cols-2">
                <button
                  type="button"
                  onClick={() => setActive("mission")}
                  className="group flex flex-col items-start"
                  aria-pressed={active === "mission"}
                >
                  <span
                    className={`font-display text-xl font-semibold uppercase tracking-[0.08em] transition-colors duration-300 sm:text-2xl ${
                      active === "mission"
                        ? "text-white"
                        : "text-white/35 group-hover:text-white/70"
                    }`}
                  >
                    Mission
                  </span>

                  <span
                    aria-hidden="true"
                    className={`mt-4 h-4 w-4 rounded-full border-2 transition-all duration-300 ${
                      active === "mission"
                        ? "border-accent-500 bg-accent-500 ring-4 ring-accent-500/20"
                        : "border-white/40 bg-primary-900"
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setActive("vision")}
                  className="group flex flex-col items-end"
                  aria-pressed={active === "vision"}
                >
                  <span
                    className={`font-display text-xl font-semibold uppercase tracking-[0.08em] transition-colors duration-300 sm:text-2xl ${
                      active === "vision"
                        ? "text-white"
                        : "text-white/35 group-hover:text-white/70"
                    }`}
                  >
                    Vision
                  </span>

                  <span
                    aria-hidden="true"
                    className={`mt-4 h-4 w-4 rounded-full border-2 transition-all duration-300 ${
                      active === "vision"
                        ? "border-accent-500 bg-accent-500 ring-4 ring-accent-500/20"
                        : "border-white/40 bg-primary-900"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Sliding content */}
            <div className="mt-12 overflow-hidden sm:mt-10">
              <div
                className="flex w-[200%] transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * 50}%)`,
                }}
              >
                {/* Mission panel */}
                <div className="w-1/2 px-2 sm:px-8">
                  <div className="mx-auto max-w-4xl text-center">
                    <h3 className="mt-6 font-display text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">
                      {content.mission.title}
                    </h3>
                  </div>
                </div>

                {/* Vision panel */}
                <div className="w-1/2 px-2 sm:px-8">
                  <div className="mx-auto max-w-4xl text-center">
                   
                    <h3 className="mt-6 font-display text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">
                      {content.vision.title}
                    </h3>

                  </div>
                </div>
              </div>
            </div>

            {/* Small journey indicator */}
            <div className="mt-10 flex justify-center gap-3">
              <span
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  active === "mission"
                    ? "w-10 bg-accent-500"
                    : "w-2 bg-white/25"
                }`}
              />
              <span
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  active === "vision" ? "w-10 bg-accent-500" : "w-2 bg-white/25"
                }`}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
