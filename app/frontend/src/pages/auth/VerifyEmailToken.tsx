import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useVerifyEmail } from '@/features/auth/auth.hooks'
import { toastClient } from '@/utils/toast'
import Button from '../../components/Button'

export default function VerifyEmailToken() {
  const { token } = useParams()
  const verifyEmailMutatuion = useVerifyEmail()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) return
    verifyEmailMutatuion.mutate(token, {
      onSuccess: () => {
        toastClient.success('Email verified successfully. You can now log in.')
        setTimeout(() => {
          navigate('/login')
        }, 1500)
      },
      onError: (error) => {
        toastClient.error(error.message || 'Failed to verify email. Please try again.')
        setTimeout(() => {
          navigate('/verify-email')
        }, 1500)
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <div className="w-full text-center">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-main">Verifying email</h1>
        <p className="mt-2 text-sm text-muted">
          {token ? 'We are verifying your account.' : 'Missing verification token.'}
        </p>
      </div>

      <div className="space-y-3">
        <Button className="w-full">Continue</Button>
        <Link className="block text-sm text-accent hover:text-accent-hover" to="/login">
          Back to login
        </Link>
      </div>
    </div>
  )
}
