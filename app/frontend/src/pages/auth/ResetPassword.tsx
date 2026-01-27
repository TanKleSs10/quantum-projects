import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router'
import { useResetPassword } from '@/features/auth/auth.hooks'
import { resetPasswordSchema, type ResetPasswordSchema } from '@/schemas/auth/resetPassword.schema'
import { toastClient } from '@/utils/toast'
import Button from '../../components/Button'
import InputText from '../../components/InputText'

export default function ResetPassword() {
  const { register, formState: { errors }, handleSubmit } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange'
  })
  const token = useParams().token as string
  const resetPasswordMutation = useResetPassword()
  const navigation = useNavigate()
  const handleFormSubmit = handleSubmit((data) => {
    const { password } = data
    resetPasswordMutation.mutate({
      token,
      password,
    }, {
      onSuccess: () => {
        toastClient.success('Password has been reset successfully. Please login with your new password.')
        setTimeout(() => {
          navigation('/login')
        }, 1500)
      },
      onError: (error) => {
        toastClient.error(error.message ?? 'Failed to reset password. Please try again.')
      }
    })
  })

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-main">Set new password</h1>
        <p className="mt-2 text-sm text-muted">
          Create a new password to access your account
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleFormSubmit}>
        <InputText label="New password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
        <InputText label="Confirm password" type="password" placeholder="••••••••" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
        <Button className="w-full" type="submit">
          Update password
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted">
        <Link className="text-accent hover:text-accent-hover" to="/login">
          Back to login
        </Link>
      </div>
    </div>
  )
}
