import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/shared/PageHero";
import { ContactDetails } from "@/components/sections/contact/ContactDetails";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { ContactIntro } from "@/components/sections/contact/ContactIntro";
import { ServiceTimes } from "@/components/sections/contact/ServiceTimes";
import { usePageMeta } from "@/hooks/usePageMeta";

const DESIGN_CONTACT = {
  email: "hello@nfpc.org",
  phone: "+231 77 000 0000",
  address: "Bishop Fence Road, Police Academy Community, Monrovia",
};

export function Contact() {
  usePageMeta("Contact", "Get in touch with NFPC.");

  return (
    <>
      <PageHero
        title="Contact us"
        description="Send us a message, or reach the church directly using the details beside the form."
      />

      <section className="py-16 sm:py-24">
        <Container className="grid gap-16 lg:grid-cols-12">
          {/* Contact form */}
          <div className="lg:col-span-7">
            <ContactIntro />
            <ContactForm />
          </div>

          {/* Contact information */}
          <aside
            className="space-y-12 lg:col-span-5"
            aria-label="Church contact details"
          >
            <ContactDetails
              email={DESIGN_CONTACT.email}
              phone={DESIGN_CONTACT.phone}
              address={DESIGN_CONTACT.address}
            />

            <ServiceTimes />
          </aside>
        </Container>
      </section>
    </>
  );
}