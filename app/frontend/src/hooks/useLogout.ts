import { useLogout } from '@/features/auth/auth.hooks'
import { setAccessToken } from '@/api/token'
import { useAuthStore } from '@/store/auth.store'

export default function useLogoutAction() {
  const logoutMutation = useLogout()
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const logout = () => {
    setAccessToken(null)
    clearAuth()
    logoutMutation.mutate(undefined, {
      onSuccess: () => undefined,
      onError: () => undefined,
    })
  }

  return { logout, isLoading: logoutMutation.isPending }
}
