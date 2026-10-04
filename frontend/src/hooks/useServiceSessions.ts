import { getServiceSessions } from '@/lib/api/resources'
import { useApi } from './useApi'

/** Published recurring sessions (Sunday worship, Bible studies, and any the church adds). */
export function useServiceSessions() {
  const state = useApi(() => getServiceSessions(), [])
  return {
    isLoading: state.status === 'loading',
    isError: state.status === 'error',
    sessions: state.status === 'success' ? state.data : [],
  }
}

export function formatSessionTime(session: { startTime: string; endTime?: string }) {
  return session.endTime ? `${session.startTime}–${session.endTime}` : session.startTime
}

export const PLATFORM_LABEL: Record<string, string> = {
  'in-person': 'In person',
  online: 'Online',
  hybrid: 'In person and online',
}
