import { CTASection } from "@/components/sections/CTASection";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutStory } from "@/components/sections/about/AboutStory";
import { Leadership } from "@/components/sections/about/Leadership";
import { MeetThePastor } from "@/components/sections/about/MeetThePastor";
import { MissionVision } from "@/components/sections/about/MissionVision";
import { MoreAboutChurch } from "@/components/sections/about/MoreAboutChurch";
import { usePageMeta } from "@/hooks/usePageMeta";

/**
 * About page — VISUAL DESIGN PASS ONLY.
 *
 * AboutStory, MissionVision, Beliefs, and Leadership use static sample copy written for
 * this design-lock pass. None of it is confirmed NFPC content, history, doctrine, or real
 * leadership. See the TODO markers inside each section component.
 */
export function About() {
  usePageMeta(
    "About",
    "Learn about National Freedom Pentecostal Church and its leadership.",
  );

  return (
    <>
      <AboutHero />
      <AboutStory />
      <MoreAboutChurch />
      <MissionVision />
      <MeetThePastor />
      <Leadership />
      <CTASection />
    </>
  );
}
