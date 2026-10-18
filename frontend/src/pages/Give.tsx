import { PageHero } from '@/components/shared/PageHero'
import { GivingRequestCTA } from '@/components/sections/give/GivingRequestCTA'
import { GivingRequestForm } from '@/components/sections/give/GivingRequestForm'
import { WaysToGive } from '@/components/sections/give/WaysToGive'
import { usePageMeta } from '@/hooks/usePageMeta'

export function Give() {
  usePageMeta('Give', 'Support the mission of NFPC.')

  return (
    <>
      <PageHero title="Give" description="Your generosity helps sustain the work of NFPC and its ministry to the community." />
      <WaysToGive />
      <GivingRequestCTA />
      <GivingRequestForm />
    </>
  )
}
