import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { StateMessage } from '@/components/shared/StateMessage'
import { useApi } from '@/hooks/useApi'
import { usePageMeta } from '@/hooks/usePageMeta'
import { getBranch } from '@/lib/api/resources'
import { resolveMediaUrl } from '@/lib/media'

/**
 * One reusable template for every branch, selected by :slug — not a separate
 * page per branch. Only confirmed fields are shown; nothing here is invented.
 */
export function BranchPage() {
  const { slug } = useParams<{ slug: string }>()
  const state = useApi(() => getBranch(slug ?? ''), [slug])
  usePageMeta(state.status === 'success' ? state.data.name : 'Branch')

  if (state.status === 'loading') {
    return (
      <>
        <PageHero title="Loading..." />
        <StateMessage title="Loading branch..." />
      </>
    )
  }

  if (state.status === 'error') {
    return (
      <>
        <PageHero title="Branch not found" />
        <StateMessage
          tone="error"
          title="This branch could not be found"
          description="It may have been unpublished, or the link may be out of date."
          action={
            <Link to="/branches" className="text-sm font-semibold text-primary-700 underline underline-offset-4">
              See all branches
            </Link>
          }
        />
      </>
    )
  }

  const branch = state.data
  const image = resolveMediaUrl(branch.image)
  const contactDetails = [branch.address, branch.phone, branch.email].filter(Boolean)

  return (
    <>
      <PageHero title={branch.name} description={branch.leadershipInfo || undefined} />

      <section className="py-16 sm:py-24">
        <Container>
          <Link to="/branches" className="text-sm font-semibold text-primary-700 underline-offset-4 hover:underline">
            &larr; All branches
          </Link>
        </Container>

        <Container className="mt-8 grid gap-14 lg:grid-cols-12">
          <Reveal className={image ? 'lg:col-span-7' : 'lg:col-span-12'}>
            <p className="whitespace-pre-line text-lg leading-relaxed text-text-muted">{branch.description}</p>

            {branch.history && (
              <div className="mt-10">
                <h2 className="eyebrow">How this branch started</h2>
                <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-text-muted">{branch.history}</p>
              </div>
            )}

            {branch.serviceTimes && (
              <div className="mt-10">
                <h2 className="eyebrow">Service times</h2>
                <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-text-muted">{branch.serviceTimes}</p>
              </div>
            )}
          </Reveal>

          {image && (
            <Reveal className="lg:col-span-5" delay={100}>
              <div className="aspect-[4/3] overflow-hidden rounded-md bg-primary-50">
                <img src={image} alt={branch.name} className="h-full w-full object-cover" loading="lazy" />
              </div>
            </Reveal>
          )}
        </Container>

        {contactDetails.length > 0 && (
          <Container className="mt-14">
            <Reveal>
              <h2 className="eyebrow">Contact this branch</h2>
              <dl className="mt-3 max-w-lg divide-y divide-border border-y border-border">
                {branch.address && <DetailRow label="Address" value={branch.address} />}
                {branch.phone && <DetailRow label="Phone" value={branch.phone} />}
                {branch.email && (
                  <DetailRow
                    label="Email"
                    value={
                      <a className="text-primary-700 underline underline-offset-4" href={`mailto:${branch.email}`}>
                        {branch.email}
                      </a>
                    }
                  />
                )}
              </dl>
            </Reveal>
          </Container>
        )}
      </section>
    </>
  )
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-4">
      <dt className="text-sm font-semibold text-text">{label}</dt>
      <dd className="break-words text-sm text-text-muted">{value}</dd>
    </div>
  )
}
