// Session token for the admin dashboard. sessionStorage keeps it per-tab and
// clears it when the tab closes. Storage can throw in private modes, so every
// access is guarded and the app treats a missing token as signed out.
const KEY = 'nfpc.admin.token'

export function getStoredToken(): string | null {
  try {
    return sessionStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function storeToken(token: string) {
  try {
    sessionStorage.setItem(KEY, token)
  } catch {
    // Storage unavailable: the session simply won't survive a reload.
  }
}

export function clearStoredToken() {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    // Nothing to clear.
  }
}
