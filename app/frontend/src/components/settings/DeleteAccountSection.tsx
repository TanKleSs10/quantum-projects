import { useState } from 'react'
import { useNavigate } from 'react-router'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import useLogoutAction from '@/hooks/useLogout'
import { useDeleteAccount } from '@/features/user/user.hooks'
import { toastClient } from '@/utils/toast'

export default function DeleteAccountSection() {
  const [confirmed, setConfirmed] = useState(false)
  const deleteAccountMutation = useDeleteAccount()
  const { logout } = useLogoutAction()
  const navigate = useNavigate()

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate(undefined, {
      onSuccess: () => {
        toastClient.success('Account deleted successfully')
        logout()
        navigate('/login')
      },
      onError: (error) => {
        toastClient.error(error.message || 'Failed to delete account')
      },
    })
  }

  return (
    <DashboardCard
      title="Account"
      description="Danger zone"
    >
      <div className="space-y-4">
        <p className="text-sm text-muted">
          Deleting your account is irreversible. All projects, tasks, and data will be removed.
        </p>
        <label className="flex items-start gap-3 rounded-md border border-border bg-base px-3 py-3 text-sm text-secondary">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-border bg-base"
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
          />
          <span>I understand that this action is permanent.</span>
        </label>
        <div className="flex justify-end">
          <Button
            type="button"
            className="border border-danger bg-danger/10 text-danger hover:bg-danger/20"
            onClick={handleDeleteAccount}
            disabled={!confirmed}
          >
            Delete account
          </Button>
        </div>
      </div>
    </DashboardCard>
  )
}
