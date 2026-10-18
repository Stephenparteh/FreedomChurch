import { PageHero } from '@/components/shared/PageHero'
import { EventsList } from '@/components/sections/events/EventsList'
import { usePageMeta } from '@/hooks/usePageMeta'

export function Events() {
  usePageMeta('Events', 'Upcoming events and services at NFPC.')

  return (
    <>
      <PageHero title="Events" description="Services, studies, and gatherings for the whole church family." />
      <EventsList />
    </>
  )
}
