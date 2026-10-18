import { getSiteSettings } from '@/lib/api/resources'
import { visibleText } from '@/lib/format'
import { useApi } from './useApi'

/**
 * The backend's SiteSetting singleton is the only source for church-wide facts.
 * Unset values come back as empty strings, and components omit them. Developer
 * placeholders such as TODO_CONFIRM_* are removed here and never shown to visitors.
 */
export function useSiteSettings() {
  const state = useApi(() => getSiteSettings(), [])
  const settings = state.status === 'success' ? state.data : null

  return {
    isLoading: state.status === 'loading',
    isError: state.status === 'error',
    churchName: visibleText(settings?.churchName) || 'National Freedom Pentecostal Church',
    motto: visibleText(settings?.motto),
    description: visibleText(settings?.description),
    email: visibleText(settings?.email),
    phone: visibleText(settings?.phone),
    address: visibleText(settings?.address),
    footerNote: visibleText(settings?.footerNote),
    socials: settings?.socials ?? {},
    givingMethods: settings?.givingMethods ?? [],
  }
}
