import { Navigate, Outlet, useLocation } from 'react-router'
import LoadingScreen from '@/components/LoadingScreen'
import { useAuthStore } from '@/store/auth.store'

export default function GuestGuard() {
  const { authChecked, isAuthenticated, user } = useAuthStore((state) => state)
  const location = useLocation()

  if (!authChecked) {
    return <LoadingScreen />
  }

  if (isAuthenticated) {
    if (user?.isVerified === false && location.pathname.startsWith('/verify-email')) {
      return <Outlet />
    }
    if (user?.isVerified === true && location.pathname.startsWith('/verify-email')) {
      return <Navigate to="/" replace />
    }
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
