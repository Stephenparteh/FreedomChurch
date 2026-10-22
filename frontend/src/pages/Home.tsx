import { AboutPreview } from "@/components/sections/AboutPreview";
import { CTASection } from "@/components/sections/CTASection";
import { EventsPreview } from "@/components/sections/EventsPreview";
import { Hero } from "@/components/sections/Hero";
import { ServiceInfo } from "@/components/sections/ServiceInfo";
import { SermonsPreview } from "@/components/sections/SermonsPreview";
import { MeetThePastor } from "@/components/sections/about/MeetThePastor";
import { usePageMeta } from "@/hooks/usePageMeta";

export function Home() {
  usePageMeta(
    "Home",
    "National Freedom Pentecostal Church, a place of worship and community.",
  );

  return (
    <>
      <Hero />
      <AboutPreview />
      <MeetThePastor />
      <ServiceInfo />
      <SermonsPreview />
      <EventsPreview />
      <CTASection />
    </>
  );
}
