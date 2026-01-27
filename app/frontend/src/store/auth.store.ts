import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { User } from '@/features/user/user.types'

type AuthStore = {
  isAuthenticated: boolean
  setAuthenticated: (value: boolean) => void
  user: User | null
  setUser: (user: User | null) => void
  tokenExpiresAt: number | null
  setTokenExpiresAt: (value: number | null) => void
  authChecked: boolean
  setAuthChecked: (checked: boolean) => void
  sessionInitialized: boolean
  setSessionInitialized: (value: boolean) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      isAuthenticated: false,
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      user: null,
      setUser: (user) => set({ user }),
      tokenExpiresAt: null,
      setTokenExpiresAt: (value) => set({ tokenExpiresAt: value }),
      authChecked: false,
      setAuthChecked: (checked) => set({ authChecked: checked }),
      sessionInitialized: false,
      setSessionInitialized: (value) => set({ sessionInitialized: value }),
      clearAuth: () => set({
        isAuthenticated: false,
        user: null,
        tokenExpiresAt: null,
        authChecked: true,
        sessionInitialized: false,
      }),
    }),
    { name: 'auth-store' }
  )
)
