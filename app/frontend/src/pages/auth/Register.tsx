import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { useRegister } from '@/features/auth/auth.hooks'
import { registerSchema, type RegisterSchema } from '@/schemas/auth/register.schema'
import { toastClient } from '@/utils/toast'
import Button from '../../components/Button'
import InputText from '../../components/InputText'

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  })

  const registerMutation = useRegister()
  const navigate = useNavigate()

  const handleFormSubmit = handleSubmit((data: RegisterSchema) => {
    registerMutation.mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        onError: (error) => {
          setError('root', {
            message: error.message || 'An unexpected error occurred. Please try again.',
          })
        },
        onSuccess: () => {
          toastClient.success('Account created. Check your email to verify.')
          setTimeout(() => navigate('/verify-email'), 1500)
        }
      }
    )
  })

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-main">Create account</h1>
        <p className="mt-2 text-sm text-muted">
          Start managing your projects in minutes
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleFormSubmit}>
        <InputText label="Name" placeholder="Jane Doe" {...register('name')} error={errors.name?.message} />
        <InputText label="Email" type="email" placeholder="you@email.com" {...register('email')} error={errors.email?.message} />
        <InputText label="Password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
        <InputText label="Confirm password" type="password" placeholder="••••••••" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
        <Button className="w-full" type='submit'>Create account</Button>
        {errors.root ? (
          <p className="mt-2 text-center text-sm text-danger">
            {errors.root.message}
          </p>
        ) : null}
      </form>

      <div className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link className="text-accent hover:text-accent-hover" to="/login">
          Sign in
        </Link>
      </div>
    </div>
  )
}
