import { useMutation, useQuery } from '@tanstack/react-query'
import { changePassword, deleteAccount, getMe, updateMe } from '@/features/user/user.api'
import type { ApiUserResponse, MeChangePasswordPayload, MeResponse, MeUpdatePayload } from '@/features/user/user.types'

export const useMe = () => {
  return useQuery<MeResponse>({
    queryKey: ['me'],
    queryFn: () => getMe(),
    enabled: false,
  })
}

export const useUpdateMe = () => {
  return useMutation<MeResponse, Error, MeUpdatePayload>({
    mutationFn: (payload: MeUpdatePayload) => updateMe(payload),
  })
}

export const useChangePassword = () => {
  return useMutation<ApiUserResponse, Error, MeChangePasswordPayload>({
    mutationFn: (payload: MeChangePasswordPayload) => changePassword(payload)
  })
}

export const useDeleteAccount = () => {
  return useMutation<ApiUserResponse>({
    mutationFn: () => deleteAccount(),
  })
}
