import type { User } from '@/features/user/user.types'

export type RegisterPayload = {
  name: string
  email: string
  password: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type AuthResponse = {
  userId: string
  username: string
  email: string
  token: string
}

export type AuthError = {
  message: string
  success: number
}

export type VerifyEmailPayload = {
  email: string
}

export type VerifyEmailResponse = {
  message: string
}

export type LoginResponse = {
  success: boolean
  data: User
  token: string
}

export type RefreshTokenResponse = {
  success: boolean
  token: string
}

export type ForgotPasswordPayload = {
  email: string
}

export type ForgotPasswordResponse = {
  success: boolean
  message: string
}

export type ResetPasswordPayload = {
  token: string
  password: string
}

export type ResetPasswordResponse = {
  success: boolean
  message: string
}
