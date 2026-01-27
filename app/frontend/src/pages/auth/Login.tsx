import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { getTokenExpiry, setAccessToken } from '@/api/token'
import { useLogin } from '@/features/auth/auth.hooks'
import { loginSchema, type LoginSchema } from '@/schemas/auth/login.schema'
import { useAuthStore } from '@/store/auth.store'
import { toastClient } from '@/utils/toast'
import Button from '../../components/Button'
import InputText from '../../components/InputText'

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  })

  const loginMutation = useLogin()
  const { setAuthenticated, setTokenExpiresAt, setUser } = useAuthStore((state) => state)
  const navigate = useNavigate()

  const handleFormSubmit = handleSubmit((data: LoginSchema) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    }, {
      onError: (error) => {
        setError('root', {
          message: error.message || 'Unable to sign in. Please try again.',
        })
      },
      onSuccess: (res) => {
        setAccessToken(res.token)
        setTokenExpiresAt(getTokenExpiry(res.token))
        setAuthenticated(true)
        setUser(res.data)
        toastClient.success('Welcome back.')
        if (res.data.isVerified === false) {
          navigate('/verify-email')
          return
        }
        navigate('/')
      }
    })
  })

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-main">Login</h1>
        <p className="mt-2 text-sm text-muted">
          Sign in to manage your projects
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleFormSubmit}>
        <InputText label="Email" type="email" placeholder="you@email.com" {...register('email')} error={errors.email?.message} />
        <InputText label="Password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
        <Button className="w-full" type='submit'>Login</Button>
        {errors.root ? (
          <p className="mt-2 text-center text-sm text-danger">
            {errors.root.message}
          </p>
        ) : null}
      </form>

      <div className="mt-6 flex flex-col items-center gap-3 text-sm">
        <Link className="text-muted hover:text-accent" to="/forgot-password">
          Forgot password?
        </Link>
        <span className="text-muted">
          Don&apos;t have an account?{' '}
          <Link className="text-accent hover:text-accent-hover" to="/register">
            Sign up
          </Link>
        </span>
      </div>
    </div>
  )
}
