import { useMutation } from '@tanstack/react-query'
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from '@/features/auth/auth.types'
import {
  forgotPassword,
  login,
  refreshToken,
  register,
  resendVerification,
  logout,
  resetPassword,
  verifyEmail,
} from './auth.api'

export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
  })
}

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => verifyEmail(token),
  })
}

export const useResendVerification = () => {
  return useMutation({
    mutationFn: (payload: VerifyEmailPayload) => resendVerification(payload),
  })
}

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      login(payload),
  })
}

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: () => refreshToken(),
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload)
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload)
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: () => logout(),
  })
}
