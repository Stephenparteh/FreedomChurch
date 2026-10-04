import { useEffect } from 'react'
import { siteConfig } from '@/data/site'

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
  return el
}

/**
 * Sets the document title and description, plus Open Graph title and description,
 * for the current page. Values are restored when the page unmounts.
 */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${siteConfig.shortName}` : siteConfig.name
    const previousTitle = document.title
    document.title = fullTitle

    const descriptionEl = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDescription = descriptionEl?.getAttribute('content') ?? ''
    if (description) setMeta('name', 'description', description)

    const ogTitle = setMeta('property', 'og:title', fullTitle)
    const ogDescription = description ? setMeta('property', 'og:description', description) : null

    return () => {
      document.title = previousTitle
      const current = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (current && description) current.setAttribute('content', previousDescription)
      ogTitle.setAttribute('content', siteConfig.name)
      ogDescription?.setAttribute('content', previousDescription)
    }
  }, [title, description])
}
