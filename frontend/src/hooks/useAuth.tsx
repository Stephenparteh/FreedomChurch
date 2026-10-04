import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AuthContext } from '@/lib/auth/context'
import { AUTH_EXPIRED_EVENT, ApiClientError } from '@/lib/api/client'
import { adminLogin, adminLogout, adminMe, type AdminUser } from '@/lib/api/admin'
import { clearStoredToken, getStoredToken, storeToken } from '@/lib/auth/session'

type Status = 'checking' | 'authenticated' | 'anonymous'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('checking')
  const [user, setUser] = useState<AdminUser | null>(null)

  // Restore a session from this tab's storage, if one exists.
  useEffect(() => {
    if (!getStoredToken()) {
      setStatus('anonymous')
      return
    }
    adminMe()
      .then(({ data }) => {
        setUser(data)
        setStatus('authenticated')
      })
      .catch(() => {
        clearStoredToken()
        setUser(null)
        setStatus('anonymous')
      })
  }, [])

  // Any 401 from the API ends the session immediately.
  useEffect(() => {
    const onExpired = () => {
      setUser(null)
      setStatus('anonymous')
    }
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await adminLogin(email, password)
    storeToken(data.token)
    setUser(data.user)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(async () => {
    try {
      await adminLogout()
    } catch (err) {
      // Even if the server is unreachable, the local session must end.
      if (!(err instanceof ApiClientError)) throw err
    } finally {
      clearStoredToken()
      setUser(null)
      setStatus('anonymous')
    }
  }, [])

  const value = useMemo(() => ({ status, user, login, logout }), [status, user, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
