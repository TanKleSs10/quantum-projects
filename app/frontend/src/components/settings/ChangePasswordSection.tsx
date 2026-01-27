import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import InputText from '@/components/InputText'
import { useChangePassword } from '@/features/user/user.hooks'
import { changeMePasswordSchema, type ChangeMePasswordSchema } from '@/schemas/user/meChangePassword'
import { toastClient } from '@/utils/toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export default function ChangePasswordSection() {
  const { register, formState: { errors }, handleSubmit, reset } = useForm<ChangeMePasswordSchema>({
    resolver: zodResolver(changeMePasswordSchema),
    mode: 'onChange',
  })

  const changePasswordMutation = useChangePassword()

  const handleFormSubmit = handleSubmit((data) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.password,
    }, {
      onSuccess: (res) => {
        reset()
        toastClient.success(res.message || "Password updated successfully");
      },
      onError: (error) => {
        toastClient.error(error.message || "Failed to update password");
      }
    })
  })


  return (
    <DashboardCard
      title="Security"
      description="Manage your password"
    >
      <form className="space-y-4" onSubmit={handleFormSubmit}>
        <InputText label="Current password" type="password" placeholder="••••••••" {...register('currentPassword')} error={errors.currentPassword?.message} />
        <InputText label="New password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
        <InputText label="Confirm new password" type="password" placeholder="••••••••" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
        <p className="text-xs text-muted">
          Password must be at least 8 characters and include a mix of letters and numbers.
        </p>
        <div className="flex justify-end">
          <Button type="submit" variant="outline">Update password</Button>
        </div>
      </form>
    </DashboardCard>
  )
}
