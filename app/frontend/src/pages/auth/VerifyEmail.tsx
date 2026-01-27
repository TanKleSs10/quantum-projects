import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { useResendVerification } from '@/features/auth/auth.hooks'
import { verifyEmailSchema, type VerifyEmailSchema } from '@/schemas/auth/verifyEmail.schema'
import { toastClient } from '@/utils/toast'
import Button from '../../components/Button'
import InputText from '../../components/InputText'

export default function VerifyEmail() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailSchema>({
    resolver: zodResolver(verifyEmailSchema),
    mode: 'onChange',
  })

  const resendMutation = useResendVerification()

  const handleFormSubmit = handleSubmit((data: VerifyEmailSchema) => {
    resendMutation.mutate(
      { email: data.email },
      {
        onSuccess: (res) => {
          toastClient.success(res.message || 'Verification email sent.')
        },
        onError: (error) => {
          toastClient.error(error.message || 'Unable to resend verification email.')
        }
      }
    )
  })

  return (
    <div className="w-full text-center">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-main">Verify your email</h1>
        <p className="mt-2 text-sm text-muted">
          Check your inbox and click the verification link to activate your account.
        </p>
      </div>

      <form className="space-y-4 text-left" onSubmit={handleFormSubmit}>
        <InputText
          label="Email"
          type="email"
          placeholder="you@email.com"
          {...register('email')}
          error={errors.email?.message}
        />
        <Button className="w-full" type="submit">
          Resend verification
        </Button>
      </form>

      <div className="mt-6">
        <Link className="text-sm text-accent hover:text-accent-hover" to="/login">
          Back to login
        </Link>
      </div>
    </div>
  )
}
