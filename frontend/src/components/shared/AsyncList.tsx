import type { ReactNode } from 'react'
import { StateMessage } from './StateMessage'
import type { ApiClientError } from '@/lib/api/client'

type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: ApiClientError }
  | { status: 'success'; data: T[] }

interface AsyncListProps<T> {
  state: AsyncState<T>
  loadingLabel: string
  emptyTitle: string
  emptyDescription?: string
  errorTitle: string
  className?: string
  children: (data: T[]) => ReactNode
}

/**
 * The loading/error/empty/success branch every API-backed list section
 * needs (see docs/API.md's frontend-integration notes). Centralized so
 * each page only has to describe its own copy, not re-derive the branching.
 */
export function AsyncList<T>({
  state,
  loadingLabel,
  emptyTitle,
  emptyDescription,
  errorTitle,
  className = 'mt-10',
  children,
}: AsyncListProps<T>) {
  if (state.status === 'loading') {
    return <StateMessage title={loadingLabel} className={className} />
  }
  if (state.status === 'error') {
    return (
      <StateMessage
        tone="error"
        title={errorTitle}
        description={state.error.message}
        className={className}
      />
    )
  }
  if (state.data.length === 0) {
    return <StateMessage title={emptyTitle} description={emptyDescription} className={className} />
  }
  return <>{children(state.data)}</>
}
