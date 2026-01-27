import { Navigate, Outlet } from 'react-router'
import LoadingScreen from '@/components/LoadingScreen'
import { useAuthStore } from '@/store/auth.store'

export default function AuthGuard() {
  const { authChecked, isAuthenticated, user } = useAuthStore((state) => state)

  if (!authChecked) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.isVerified === false) {
    return <Navigate to="/verify-email" replace />
  }

  return <Outlet />
}
