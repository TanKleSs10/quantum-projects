import { useEffect } from 'react'
import { getTokenExpiry, setAccessToken } from '@/api/token'
import { refreshToken } from '@/features/auth/auth.api'
import { useMe } from '@/features/user/user.hooks'
import { useAuthStore } from '@/store/auth.store'

export default function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const {
    authChecked,
    clearAuth,
    isAuthenticated,
    setAuthChecked,
    setAuthenticated,
    setTokenExpiresAt,
    setUser,
    tokenExpiresAt,
  } = useAuthStore((state) => state)
  const meQuery = useMe()

  useEffect(() => {
    if (authChecked) {
      return
    }

    const bootstrapSession = async () => {
      try {
        const refresh = await refreshToken()
        if (!refresh?.token) {
          setAuthenticated(false)
          setUser(null)
          setTokenExpiresAt(null)
          setAuthChecked(true)
          return
        }

        setAccessToken(refresh.token)
        setTokenExpiresAt(getTokenExpiry(refresh.token))
        await meQuery.refetch()
      } catch {
        setAuthenticated(false)
        setUser(null)
        setTokenExpiresAt(null)
        setAuthChecked(true)
      }
    }

    bootstrapSession()
  }, [
    authChecked,
    meQuery,
    setAuthChecked,
    setAuthenticated,
    setTokenExpiresAt,
    setUser,
  ])

  useEffect(() => {
    if (!meQuery.isFetched) {
      return
    }

    const user = meQuery.data?.user ?? meQuery.data?.data ?? null
    if (user) {
      setAuthenticated(true)
      setUser(user)
      setAuthChecked(true)
      return
    }

    setAuthenticated(false)
    setUser(null)
    setAuthChecked(true)
  }, [meQuery.data, meQuery.isFetched, setAuthChecked, setAuthenticated, setUser])

  useEffect(() => {
    if (!isAuthenticated || !tokenExpiresAt) {
      return
    }

    const bufferMs = 2 * 60 * 1000
    const delay = Math.max(tokenExpiresAt - Date.now() - bufferMs, 0)

    const timeoutId = setTimeout(async () => {
      try {
        const refresh = await refreshToken()
        if (refresh?.token) {
          setAccessToken(refresh.token)
          setTokenExpiresAt(getTokenExpiry(refresh.token))
        } else {
          setAccessToken(null)
          clearAuth()
        }
      } catch {
        // Keep current session on transient errors.
      }
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [clearAuth, isAuthenticated, setTokenExpiresAt, tokenExpiresAt])

  return <>{children}</>
}
