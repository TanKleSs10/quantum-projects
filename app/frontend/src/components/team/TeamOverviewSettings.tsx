import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'

export default function TeamOverviewSettings() {
  return (
    <DashboardCard
      title="Settings"
      description="Team settings will be available in a future update."
    >
      <p className="text-sm text-muted">
        Settings for roles, billing, and integrations are not enabled in the MVP.
      </p>
      <div className="mt-4">
        <Button variant="outline" disabled>
          Manage settings
        </Button>
      </div>
    </DashboardCard>
  )
}
