import { apiRequest } from '@/api/client'
import { ApiError } from '@/types/api-error'
import type {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginPayload,
  LoginResponse,
  RefreshTokenResponse,
  RegisterPayload,
  ResetPasswordPayload,
  ResetPasswordResponse,
  VerifyEmailPayload,
  VerifyEmailResponse,
} from '@/features/auth/auth.types'

export function register(payload: RegisterPayload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function verifyEmail(token: string) {
  return apiRequest(`/auth/verify-email/${token}`, {
    method: 'GET',
  })
}

export function resendVerification(payload: VerifyEmailPayload) {
  return apiRequest<VerifyEmailResponse>('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function login(payload: LoginPayload) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function refreshToken() {
  try {
    return await apiRequest<RefreshTokenResponse>('/auth/refresh', {
      method: 'POST',
    })
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 404)) {
      return null
    }
    throw error
  }
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiRequest<ForgotPasswordResponse>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiRequest<ResetPasswordResponse>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function logout() {
  return apiRequest('/auth/logout', {
    method: 'POST',
  })
}
