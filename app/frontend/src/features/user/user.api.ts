import { apiRequest } from '@/api/client'
import type { ApiUserResponse, MeChangePasswordPayload, MeResponse, MeUpdatePayload } from '@/features/user/user.types'

export function getMe() {
  return apiRequest<MeResponse>('/users/me', {
    method: 'GET',
  })
}

export function updateMe(payload: MeUpdatePayload): Promise<MeResponse> {
  return apiRequest<MeResponse>('/users/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function changePassword(payload: MeChangePasswordPayload) {
  return apiRequest<ApiUserResponse>('/users/me/change-password', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function deleteAccount() {
  return apiRequest<ApiUserResponse>('/users/me', {
    method: 'DELETE',
  })
}

