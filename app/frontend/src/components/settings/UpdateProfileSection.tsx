import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import InputText from '@/components/InputText'
import { useUpdateMe } from '@/features/user/user.hooks'
import { meUpdateSchema, type MeUpdateSchema } from '@/schemas/user/meUpdate.schema'
import { useAuthStore } from '@/store/auth.store'
import { toastClient } from '@/utils/toast'

type UpdateProfileSectionProps = {
  email: string
}

export default function UpdateProfileSection({ email }: UpdateProfileSectionProps) {
  const { register, formState: { errors }, handleSubmit, reset } = useForm<MeUpdateSchema>({
    resolver: zodResolver(meUpdateSchema),
    mode: 'onChange',
  })

  const updateMeMutation = useUpdateMe()
  const queryClient = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)
  const handleFormSubmit = handleSubmit((data) => {
    updateMeMutation.mutate(data, {
      onSuccess: (response) => {
        setUser(response.data)
        queryClient.invalidateQueries({ queryKey: ['me'] })
        reset()
        toastClient.success('Profile updated successfully')
      },
      onError: (error) => {
        toastClient.error(error.message || 'Failed to update profile')
      }
    })
  })

  return (
    <DashboardCard
      title="Profile"
      description="Update your personal information"
    >
      <form className="space-y-4" onSubmit={handleFormSubmit}>
        <InputText label="Name" placeholder="Your name" {...register('name')} error={errors.name?.message} />
        <InputText
          label="Email"
          type="email"
          placeholder={email}
          disabled
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-secondary" htmlFor="bio">
            Bio (optional)
          </label>
          <textarea
            id="bio"
            rows={4}
            {...register('bio')}
            placeholder="Share a short bio..."
            className="w-full rounded-md border border-border bg-base px-3 py-2 text-sm text-main placeholder:text-muted transition-colors duration-150 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
          />
          {errors.bio ? (
            <p className="mt-1 text-sm text-danger">{errors.bio.message}</p>
          ) : null}
        </div>
        <div className="flex justify-end">
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </DashboardCard>
  )
}
