import { getSiteSettings } from '@/lib/api/resources'
import { useApi } from './useApi'

const FALLBACK = {
  motto: '',
  email: 'TODO_CONFIRM_EMAIL',
  phone: 'TODO_CONFIRM_PHONE',
  address: 'TODO_CONFIRM_ADDRESS',
}

/**
 * The backend's SiteSetting singleton (see backend/src/models/SiteSetting.ts)
 * is the single authoritative source for church-wide facts, replacing the
 * static TODO_CONFIRM_* constants Milestones 1/2 kept in the frontend. If a
 * field is still unset in the database, that's a real, current fact — not
 * a stale fallback — so `TODO_CONFIRM_*` here reflects the database's
 * actual state, not an invented placeholder.
 */
export function useSiteSettings() {
  const state = useApi(() => getSiteSettings(), [])
  const settings = state.status === 'success' ? state.data : null

  return {
    isLoading: state.status === 'loading',
    isError: state.status === 'error',
    churchName: settings?.churchName ?? 'National Freedom Pentecostal Church',
    motto: settings?.motto || FALLBACK.motto,
    email: settings?.email || FALLBACK.email,
    phone: settings?.phone || FALLBACK.phone,
    address: settings?.address || FALLBACK.address,
    serviceTimes: settings?.serviceTimes ?? [],
  }
}
