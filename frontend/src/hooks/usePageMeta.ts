import { useEffect } from 'react'
import { siteConfig } from '@/data/site'

/**
 * Minimal SEO primitive: sets document title + meta description on mount.
 * A dedicated library (e.g. react-helmet-async) isn't justified yet since
 * this app has no server-rendering step in Milestone 1 — revisit if/when
 * SSR or richer per-route Open Graph tags are needed.
 */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title ? `${title} | ${siteConfig.shortName}` : siteConfig.name

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDescription = meta?.getAttribute('content') ?? ''

    if (description) {
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', description)
    }

    return () => {
      document.title = previousTitle
      if (meta) meta.setAttribute('content', previousDescription)
    }
  }, [title, description])
}
