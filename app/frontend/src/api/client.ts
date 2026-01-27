import { getAccessToken, getTokenExpiry, setAccessToken } from '@/api/token'
import { useAuthStore } from '@/store/auth.store'
import { toastClient } from '@/utils/toast'
import { ApiError } from '@/types/api-error'
import type { AuthError, RefreshTokenResponse } from '@/features/auth/auth.types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
let refreshPromise: Promise<string | null> | null = null

const AUTH_BYPASS_PREFIXES = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
]

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        return null
      }

      const data = (await response.json()) as RefreshTokenResponse
      const token = data?.token ?? null
      setAccessToken(token)
      useAuthStore.getState().setTokenExpiresAt(token ? getTokenExpiry(token) : null)
      return token
    })()

    refreshPromise.finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  hasRetried = false,
  hasRetriedServer = false
): Promise<T> {
  const token = getAccessToken()
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    if (response.status >= 500 && !hasRetriedServer) {
      toastClient.error('Server error. Retrying...')
      return apiRequest(endpoint, options, hasRetried, true)
    }

    if (response.status === 401 && !hasRetried && endpoint !== '/auth/refresh') {
      const refreshedToken = await refreshAccessToken()
      if (refreshedToken) {
        return apiRequest(endpoint, options, true)
      }
    }

    let errorBody: AuthError | null = null

    try {
      errorBody = await response.json()
    } catch {
      // backend no devolvió JSON
    }

    const status = response.status
    const message = errorBody?.message ?? 'Unexpected error'

    const shouldBypass = AUTH_BYPASS_PREFIXES.some((prefix) =>
      endpoint.startsWith(prefix)
    )

    if (!shouldBypass) {
      if (status === 401) {
        setAccessToken(null)
        useAuthStore.getState().clearAuth()
        window.location.assign('/login')
      }

      if (status === 403) {
        window.location.assign('/forbidden')
      }

      if (status === 404) {
        window.location.assign('/not-found')
      }
    }

    throw new ApiError(message, status)
  }

  return response.json()
}
