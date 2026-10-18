import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { AsyncList } from '@/components/shared/AsyncList'
import { PageHero } from '@/components/shared/PageHero'
import { useApi } from '@/hooks/useApi'
import { usePageMeta } from '@/hooks/usePageMeta'
import { getBranches } from '@/lib/api/resources'
import { resolveMediaUrl } from '@/lib/media'

/** General branches index — the header dropdown's "no branches yet" fallback destination, and a normal page in its own right. */
export function Branches() {
  usePageMeta('Branches', 'NFPC branch locations.')
  const state = useApi(() => getBranches(), [])

  return (
    <>
      <PageHero title="Our branches" description="Find an NFPC branch near you." />

      <section className="py-16 sm:py-24">
        <Container>
          <AsyncList
            state={state}
            loadingLabel="Loading branches..."
            emptyTitle="No branches published yet"
            emptyDescription="Branch locations will appear here once they are added and published in the admin dashboard."
            errorTitle="Unable to load branches"
            className="mt-0"
          >
            {(branches) => (
              <ul className="divide-y divide-border border-y border-border">
                {branches.map((branch) => {
                  const image = resolveMediaUrl(branch.image)
                  return (
                    <li key={branch.id}>
                      <Link
                        to={`/branches/${branch.slug}`}
                        className="group flex items-center gap-6 py-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                      >
                        {image ? (
                          <img src={image} alt="" className="h-20 w-20 shrink-0 rounded-md object-cover" loading="lazy" />
                        ) : (
                          <div aria-hidden className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-primary-900">
                            <span className="font-display text-2xl font-semibold text-white/30">{branch.name.charAt(0)}</span>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h2 className="font-display text-2xl font-semibold text-primary-900 transition-colors group-hover:text-accent-500">
                            {branch.name}
                          </h2>
                          {branch.address && <p className="mt-1 text-sm text-text-muted">{branch.address}</p>}
                        </div>
                        <span aria-hidden className="text-lg text-accent-500 transition-transform group-hover:translate-x-1">
                          &rarr;
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </AsyncList>
        </Container>
      </section>
    </>
  )
}
