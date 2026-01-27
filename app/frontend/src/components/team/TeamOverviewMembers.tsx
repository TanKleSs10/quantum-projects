import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import EmptyState from '@/components/EmptyState'
import type { TeamMember } from '@/features/team/team.types'

type TeamOverviewMembersProps = {
  members: TeamMember[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

const formatRole = (role?: TeamMember['role']) => {
  if (!role) {
    return 'Member'
  }

  return role.charAt(0).toUpperCase() + role.slice(1)
}

export default function TeamOverviewMembers({
  members,
  isLoading = false,
  isError = false,
  onRetry,
}: TeamOverviewMembersProps) {
  return (
    <DashboardCard
      title="Members"
      description="People collaborating in this team."
    >
      {isLoading ? (
        <p className="text-sm text-muted">Loading team...</p>
      ) : isError ? (
        <EmptyState
          title="Unable to load members"
          description="Try again in a moment."
          action={
            <Button variant="outline" onClick={onRetry}>
              Retry
            </Button>
          }
        />
      ) : members.length ? (
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.userId}
              className="flex items-center justify-between rounded-md border border-border bg-base px-3 py-2 text-sm"
            >
              <span className="text-main">
                {member.user?.name ?? member.userId}
              </span>
              <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-muted">
                {formatRole(member.role)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No members yet"
          description="Invite teammates when this feature is available."
        />
      )}
    </DashboardCard>
  )
}
