import ChangePasswordSection from '@/components/settings/ChangePasswordSection'
import DeleteAccountSection from '@/components/settings/DeleteAccountSection'
import UpdateProfileSection from '@/components/settings/UpdateProfileSection'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { useAuthStore } from '@/store/auth.store'

export default function Settings() {
  const user = useAuthStore((state) => state.user)

  return (
    <DashboardLayout
      title="Settings"
      userName={user?.name ?? 'User'}
      userEmail={user?.email ?? 'user@email.com'}
    >
      <div className="flex flex-col gap-6">
        <UpdateProfileSection email={user?.email ?? 'your@email.com'} />
        <ChangePasswordSection />
        <DeleteAccountSection />
      </div>
    </DashboardLayout>
  )
}
