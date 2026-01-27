import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { useForgotPassword } from '@/features/auth/auth.hooks'
import { forgotPasswordSchema, type ForgotPasswordSchema } from '@/schemas/auth/forgotPassword.schema'
import { toastClient } from '@/utils/toast'
import Button from '../../components/Button'
import InputText from '../../components/InputText'

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange'
  })

  const forgotPasswordMutation = useForgotPassword()

  const handleFormSubmit = handleSubmit((data: ForgotPasswordSchema) => {
    forgotPasswordMutation.mutate({ email: data.email },
      {
        onSuccess: (res) => {
          toastClient.success(res.message || 'Reset link sent successfully.')
        },
        onError: (error) => {
          toastClient.error(error.message ?? 'An error occurred while sending the reset link.')
        }
      }
    )
  })

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-main">Reset password</h1>
        <p className="mt-2 text-sm text-muted">
          We&apos;ll send you a link to reset your password
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleFormSubmit}>
        <InputText label="Email" type="email" placeholder="you@email.com" {...register('email')} error={errors.email?.message} />
        <Button className="w-full" type="submit">Send reset link</Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted">
        Remembered your password?{' '}
        <Link className="text-accent hover:text-accent-hover" to="/login">
          Back to login
        </Link>
      </div>
    </div>
  )
}
