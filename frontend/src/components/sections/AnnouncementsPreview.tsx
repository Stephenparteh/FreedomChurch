import { Container } from '@/components/ui/Container'
import { useApi } from '@/hooks/useApi'
import { getAnnouncements } from '@/lib/api/resources'
import { formatLongDate } from '@/lib/format'

/** Latest announcements as a red-ruled bulletin. Archived items never reach the website. */
export function AnnouncementsPreview() {
  const state = useApi(() => getAnnouncements({ limit: 3 }), [])
  if (state.status !== 'success' || state.data.length === 0) return null

  return (
    <section className="bg-surface-warm py-20 sm:py-24">
      <Container>
        <div className="flex items-end justify-between gap-6 border-b-2 border-primary-900 pb-5">
          <h2 className="font-display text-3xl font-semibold text-primary-900 sm:text-4xl">Announcements</h2>
          <p className="hidden text-sm font-semibold uppercase tracking-[0.18em] text-text-muted sm:block">What&rsquo;s new</p>
        </div>
        <ul className="divide-y divide-border-strong">
          {state.data.map((item) => (
            <li key={item.id} className="grid gap-3 py-7 md:grid-cols-12 md:gap-8">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent-500 md:col-span-2 md:pt-1.5">
                {formatLongDate(item.publishedAt)}
              </p>
              <div className="md:col-span-10">
                <h3 className="font-display text-xl font-semibold text-text sm:text-2xl">{item.title}</h3>
                <p className="mt-2 line-clamp-3 max-w-3xl whitespace-pre-line leading-relaxed text-text-muted">{item.content}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
