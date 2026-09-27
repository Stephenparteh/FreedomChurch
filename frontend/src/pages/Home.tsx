import { AboutPreview } from '@/components/sections/AboutPreview'
import { CTASection } from '@/components/sections/CTASection'
import { EventsPreview } from '@/components/sections/EventsPreview'
import { GalleryPreview } from '@/components/sections/GalleryPreview'
import { Hero } from '@/components/sections/Hero'
import { MinistriesPreview } from '@/components/sections/MinistriesPreview'
import { ServiceInfo } from '@/components/sections/ServiceInfo'
import { SermonsPreview } from '@/components/sections/SermonsPreview'
import { usePageMeta } from '@/hooks/usePageMeta'

export function Home() {
  usePageMeta(
    'Home',
    'National Freedom Pentecostal Church — a place of worship and community.',
  )

  return (
    <>
      <Hero />
      <ServiceInfo />
      <AboutPreview />
      <MinistriesPreview />
      <SermonsPreview />
      <EventsPreview />
      <GalleryPreview />
      <CTASection />
    </>
  )
}
