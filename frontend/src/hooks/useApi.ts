import { useEffect, useState } from 'react'
import { ApiClientError } from '@/lib/api/client'
import type { ApiResult } from '@/lib/api/client'
import type { PaginationMeta } from '@/types/api'

type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: ApiClientError }
  | { status: 'success'; data: T; pagination?: PaginationMeta }

/**
 * Loading/success/error for any apiFetch-backed call. "Empty" isn't a
 * distinct state here — it's just `status === 'success' && data.length ===
 * 0` for list endpoints, which each page/section checks itself so the
 * empty-state copy can be resource-specific (see StateMessage usage).
 *
 * deps controls when the request re-fires (e.g. a filter changing).
 */
export function useApi<T>(fetcher: () => Promise<ApiResult<T>>, deps: unknown[]): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    fetcher()
      .then(({ data, pagination }) => {
        if (!cancelled) setState({ status: 'success', data, pagination })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        const apiError =
          error instanceof ApiClientError
            ? error
            : new ApiClientError(0, 'UNKNOWN_ERROR', 'Something went wrong.')
        setState({ status: 'error', error: apiError })
      })

    return () => {
      cancelled = true
    }
    // oxlint's exhaustive-deps check can't verify a non-literal deps array —
    // that's intentional here: `deps` is caller-controlled by design (e.g. a
    // filter/slug changing), same pattern as any generic useAsync/useFetch hook.
  }, deps)

  return state
}
