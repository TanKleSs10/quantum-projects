import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Button from '@/components/Button'
import PageHeader from '@/components/PageHeader'
import TeamOverviewMembers from '@/components/team/TeamOverviewMembers'
import TeamOverviewProjects from '@/components/team/TeamOverviewProjects'
import TeamOverviewSettings from '@/components/team/TeamOverviewSettings'
import TeamOverviewTasks from '@/components/team/TeamOverviewTasks'
import { useTeamById, useTeamProjects, useTeamTasks } from '@/features/team/team.hooks'
import { useAuthStore } from '@/store/auth.store'
import { useLayoutStore } from '@/store/layout.store'

const formatRole = (role?: 'owner' | 'admin' | 'member') => {
  if (!role) {
    return 'Member'
  }

  return role.charAt(0).toUpperCase() + role.slice(1)
}

export default function TeamOverview() {
  const { teamId } = useParams()
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const {
    data: teamResponse,
    isLoading: isTeamLoading,
    isError: isTeamError,
    refetch: refetchTeam,
  } = useTeamById(teamId)
  const {
    data: projectsResponse,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
    refetch: refetchProjects,
  } = useTeamProjects(teamId)
  const {
    data: tasksResponse,
    isLoading: isTasksLoading,
    isError: isTasksError,
    refetch: refetchTasks,
  } = useTeamTasks(teamId)

  if (!teamId) {
    return (
      <p className="text-sm text-muted">Team not found.</p>
    )
  }

  const team = teamResponse?.data
  const setPageTitle = useLayoutStore((state) => state.setPageTitle)
  const members = team?.members ?? []
  const userRole = formatRole(members.find((member) => member.userId === user?.id)?.role)

  const projects = projectsResponse?.data ?? []
  const tasks = tasksResponse?.data ?? []

  useEffect(() => {
    setPageTitle(team?.name ?? 'Team')
    return () => setPageTitle(null)
  }, [setPageTitle, team?.name])

  return (
    <>
      <section>
        <PageHeader
          title={team?.name ?? 'Team'}
          description={team?.description}
        />
        <div className="flex w-full justify-between">
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted">
            <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-main">
              {userRole}
            </span>
            <span>Your role in this team</span>
          </div>
          <div>
            <Link to="/teams">
              <Button variant="outline">Back to teams</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <TeamOverviewProjects
          projects={projects}
          isLoading={isProjectsLoading}
          isError={isProjectsError}
          onRetry={refetchProjects}
          onCreate={() => navigate('/projects/create')}
        />
        <TeamOverviewMembers
          members={members}
          isLoading={isTeamLoading}
          isError={isTeamError}
          onRetry={refetchTeam}
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <TeamOverviewTasks
          tasks={tasks}
          isLoading={isTasksLoading}
          isError={isTasksError}
          onRetry={refetchTasks}
        />
        <TeamOverviewSettings />
      </section>
    </>
  )
}
