import { Link } from 'react-router'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import EmptyState from '@/components/EmptyState'
import { useTeamProjects } from '@/features/team/team.hooks'

export default function TeamOverviewProjects({ teamId }: { teamId: string }) {
  const {
    data,
    isLoading,
    isError,
    refetch
  } = useTeamProjects(teamId)
  const projects = data?.data

  return (
    <DashboardCard
      title="Projects"
      description="Projects currently tracked in this team."
      action={
        <Link to={`/teams/${teamId}/project/create`}>
          <Button variant="primary">
            Create project
          </Button>
        </Link>
      }
    >
      {isLoading ? (
        <p className="text-sm text-muted">Loading projects...</p>
      ) : isError ? (
        <EmptyState
          title="Unable to load projects"
          description="Try again in a moment."
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      ) : projects!.length ? (
        <div className="space-y-3">
          {projects!.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="block rounded-md border border-border bg-base px-4 py-3 transition-colors hover:border-secondary"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium text-main">{project.name}</p>
                <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-muted">
                  {project.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects yet"
          description="Create a project to start organizing work."
          action={
            <Link to={`/teams/${teamId}/project/create`}>
              <Button variant="primary" >
                Create project
              </Button>
            </Link>
          }
        />
      )}
    </DashboardCard>
  )
}
