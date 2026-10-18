import { Container } from "@/components/ui/Container";

export function ContactIntro() {
  return (
    <section className="pb-10 sm:pb-12">
      <Container className="px-0">
        <div className="max-w-2xl">
          <h2 className="mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-tight text-primary-900 sm:text-6xl lg:text-7xl">
            Let&apos;s talk.
          </h2>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
            Have a question, need more information, or simply want to reach out?
            Send us a message and we&apos;ll get back to you.
          </p>
        </div>
      </Container>
    </section>
  );
}
