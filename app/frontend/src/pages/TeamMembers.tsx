import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import EmptyState from '@/components/EmptyState'
import InputText from '@/components/InputText'
import PageHeader from '@/components/PageHeader'
import { useDemoteTeamMember, usePromoteTeamMember, useTeamById } from '@/features/team/team.hooks'
import type { TeamMember } from '@/features/team/team.types'
import { useAuthStore } from '@/store/auth.store'
import { useLayoutStore } from '@/store/layout.store'
import { toastClient } from '@/utils/toast'

const formatRole = (role?: TeamMember['role']) => {
  if (!role) {
    return 'Member'
  }

  return role.charAt(0).toUpperCase() + role.slice(1)
}

type ActiveAction = {
  userId: string
  type: 'promote' | 'demote'
} | null

export default function TeamMembers() {
  const { teamId } = useParams()
  const user = useAuthStore((state) => state.user)
  const setPageTitle = useLayoutStore((state) => state.setPageTitle)
  const [activeAction, setActiveAction] = useState<ActiveAction>(null)

  const teamQuery = useTeamById(teamId)
  const promoteMutation = usePromoteTeamMember(teamId ?? '')
  const demoteMutation = useDemoteTeamMember(teamId ?? '')

  useEffect(() => {
    setPageTitle('Team members')
    return () => setPageTitle(null)
  }, [setPageTitle])

  const team = teamQuery.data?.data
  const members = team?.members ?? []

  const currentMember = useMemo(
    () => members.find((member) => member.userId === user?.id),
    [members, user?.id]
  )

  const canManageMembers = currentMember?.role === 'owner'
  const isBusy = promoteMutation.isPending || demoteMutation.isPending

  const handlePromote = (memberId: string) => {
    if (!teamId || isBusy) {
      return
    }

    setActiveAction({ userId: memberId, type: 'promote' })
    promoteMutation.mutate(memberId, {
      onSuccess: () => {
        toastClient.success('Member promoted to admin')
        teamQuery.refetch()
      },
      onError: (error) => {
        toastClient.error(error.message || 'Failed to promote member')
      },
      onSettled: () => setActiveAction(null),
    })
  }

  const handleDemote = (memberId: string) => {
    if (!teamId || isBusy) {
      return
    }

    setActiveAction({ userId: memberId, type: 'demote' })
    demoteMutation.mutate(memberId, {
      onSuccess: () => {
        toastClient.success('Member demoted to member')
        teamQuery.refetch()
      },
      onError: (error) => {
        toastClient.error(error.message || 'Failed to demote member')
      },
      onSettled: () => setActiveAction(null),
    })
  }

  if (!teamId) {
    return (
      <p className="text-sm text-muted">Team not found.</p>
    )
  }

  return (
    <>
      <section>
        <PageHeader
          title="Members"
          description={team?.name ? `Manage roles for ${team.name}.` : 'Manage roles for your team.'}
          action={(
            <Link to={`/teams/${teamId}`}>
              <Button variant="outline">Back to team</Button>
            </Link>
          )}
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardCard
          title="Team members"
          description="Promote or demote members when needed."
        >
          {teamQuery.isLoading ? (
            <p className="text-sm text-muted">Loading members...</p>
          ) : teamQuery.isError ? (
            <EmptyState
              title="Unable to load members"
              description="Try again in a moment."
              action={(
                <Button variant="outline" onClick={() => teamQuery.refetch()}>
                  Retry
                </Button>
              )}
            />
          ) : members.length === 0 ? (
            <EmptyState
              title="No members yet"
              description="Invite teammates when this feature is available."
            />
          ) : (
            <div className="space-y-3">
              {members.map((member) => {
                const isOwner = member.role === 'owner'
                const isSelf = member.userId === user?.id
                const canPromote = canManageMembers && member.role === 'member'
                const canDemote = canManageMembers && member.role === 'admin'
                const isActionPending =
                  activeAction?.userId === member.userId &&
                  ((activeAction.type === 'promote' && promoteMutation.isPending) ||
                    (activeAction.type === 'demote' && demoteMutation.isPending))

                return (
                  <div
                    key={member.userId}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-base px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="text-sm font-medium text-main">
                        {member.user?.name ?? 'Unknown member'}
                      </p>
                      <p className="text-xs text-muted">
                        {member.user?.email ?? member.userId}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-muted">
                        {formatRole(member.role)}
                      </span>
                      {canPromote ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isBusy || isSelf}
                          onClick={() => handlePromote(member.userId)}
                        >
                          {isActionPending ? 'Promoting...' : 'Promote to admin'}
                        </Button>
                      ) : null}
                      {canDemote ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isBusy || isSelf || isOwner}
                          onClick={() => handleDemote(member.userId)}
                        >
                          {isActionPending ? 'Demoting...' : 'Demote to member'}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </DashboardCard>

        <DashboardCard
          title="Invite members"
          description="Invitations are disabled for now."
        >
          <div className="space-y-3">
            <InputText
              label="Email address"
              placeholder="name@company.com"
              disabled
            />
            <Button className="w-full" disabled>
              Send invite
            </Button>
            <p className="text-xs text-muted">
              We will enable invites in a future release.
            </p>
          </div>
        </DashboardCard>
      </section>
    </>
  )
}
