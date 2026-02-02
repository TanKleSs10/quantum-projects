import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import Button from '@/components/Button'
import EmptyState from '@/components/EmptyState'
import PageHeader from '@/components/PageHeader'
import ProjectQuickActions from '@/components/project/ProjectQuickActions'
import ProjectTaskBoard from '@/components/project/ProjectTaskBoard'
import { useProjectById } from '@/features/projects/projects.hooks'
import { useTasksByProject } from '@/features/tasks/tasks.hooks'
import { useTeamById } from '@/features/team/team.hooks'
import { useAuthStore } from '@/store/auth.store'
import { useLayoutStore } from '@/store/layout.store'

export default function ProjectOverview() {
  const { projectId } = useParams()
  const projectQuery = useProjectById(projectId)
  const tasksQuery = useTasksByProject(projectId)
  const project = projectQuery.data?.data
  const teamQuery = useTeamById(project?.teamId)
  const user = useAuthStore((state) => state.user)
  const setPageTitle = useLayoutStore((state) => state.setPageTitle)

  const role = teamQuery.data?.data.members?.find((member) => member.userId === user?.id)?.role
  const canManage = role === 'owner' || role === 'admin'

  useEffect(() => {
    setPageTitle(project?.name ?? 'Project')
    return () => setPageTitle(null)
  }, [project?.name, setPageTitle])

  if (!projectId) {
    return (
      <EmptyState
        title="Project not found"
        description="Select a project from the list to view details."
      />
    )
  }

  return (
    <>
      <section>
        <PageHeader
          title={project?.name ?? 'Project'}
          description={project?.description ?? 'Track key milestones and deliverables.'}
          action={(
            <div className="flex flex-wrap items-center gap-2">
              <Link to={`/projects/${projectId}/task/create`}>
                <Button>Create task</Button>
              </Link>
              <Link to="/projects">
                <Button variant="outline">Back to projects</Button>
              </Link>
            </div>
          )}
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <ProjectTaskBoard
          projectId={projectId}
          tasks={tasksQuery.data?.data ?? []}
          isLoading={tasksQuery.isLoading}
          isError={tasksQuery.isError}
          onRetry={() => tasksQuery.refetch()}
        />
        <ProjectQuickActions projectId={projectId} canManage={canManage} />
      </section>
    </>
  )
}
