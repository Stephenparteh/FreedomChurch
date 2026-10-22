import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import { ContactDetails } from "@/components/sections/contact/ContactDetails";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { ContactIntro } from "@/components/sections/contact/ContactIntro";
import { ServiceTimes } from "@/components/sections/contact/ServiceTimes";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function Contact() {
  usePageMeta("Contact", "Get in touch with NFPC.");
  const { email, phone, address } = useSiteSettings();

  return (
    <>
      <PageHero
        title="Contact us"
        description="Send us a message, or reach the church directly using the details beside the form."
      />

      <section className="py-16 sm:py-24">
        <Container className="grid gap-16 lg:grid-cols-12">
          {/* Contact form */}
          <Reveal className="lg:col-span-7">
            <ContactIntro />
            <ContactForm />
          </Reveal>

          {/* Contact information */}
          <Reveal
            as="aside"
            className="space-y-12 lg:col-span-5"
            delay={100}
            aria-label="Church contact details"
          >
            <ContactDetails
              email={email}
              phone={phone}
              address={address}
            />

            <ServiceTimes />
          </Reveal>
        </Container>
      </section>
    </>
  );
}