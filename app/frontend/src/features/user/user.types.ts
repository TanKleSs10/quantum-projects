export type User = {
  id: string
  name: string
  email: string
  isVerified: boolean
}

export type MeUpdatePayload = {
  name?: string
  bio?: string
}

export type MeChangePasswordPayload = {
  currentPassword: string
  newPassword: string
}

export type MeResponse = {
  data: User
  success: boolean
}

export type ApiUserResponse = {
  success: boolean
  message: string
}
