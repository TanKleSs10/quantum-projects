import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import EmptyState from '@/components/EmptyState'
import PageHeader from '@/components/PageHeader'
import ProjectItem from '@/components/ProjectItem'
import TaskItem from '@/components/TaskItem'
import {
  useArchiveProject,
  useCompleteProject,
  useDeleteProject,
  usePauseProject,
  useProjectById,
  useResumeProject,
} from '@/features/projects/projects.hooks'
import { toastClient } from '@/utils/toast'
import { useLayoutStore } from '@/store/layout.store'

export default function ProjectOverview() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const projectQuery = useProjectById(projectId)
  const pauseMutation = usePauseProject(projectId ?? '')
  const resumeMutation = useResumeProject(projectId ?? '')
  const completeMutation = useCompleteProject(projectId ?? '')
  const archiveMutation = useArchiveProject(projectId ?? '')
  const deleteMutation = useDeleteProject(projectId ?? '')
  const [deleteConfirmed, setDeleteConfirmed] = useState(false)

  const project = projectQuery.data?.data
  const setPageTitle = useLayoutStore((state) => state.setPageTitle)
  const tasks = [
    { title: 'Kickoff alignment', priority: 'medium' as const },
    { title: 'Wireframe review', priority: 'high' as const },
  ]

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

  const handleStatusChange = (action: 'pause' | 'resume' | 'complete' | 'archive') => {
    const mutationMap = {
      pause: pauseMutation,
      resume: resumeMutation,
      complete: completeMutation,
      archive: archiveMutation,
    }
    mutationMap[action].mutate(undefined, {
      onSuccess: () => {
        projectQuery.refetch()
        toastClient.success('Project updated successfully')
      },
      onError: (error) => {
        toastClient.error(error.message || 'Unable to update project')
      },
    })
  }

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toastClient.success('Project deleted successfully')
        navigate('/projects')
      },
      onError: (error) => {
        toastClient.error(error.message || 'Unable to delete project')
      },
    })
  }

  return (
    <>
      <section>
        <PageHeader
          title={project?.name ?? 'Project'}
          description={project?.description ?? 'Track key milestones and deliverables.'}
          action={(
            <Link to="/projects">
              <Button variant="outline">Back to projects</Button>
            </Link>
          )}
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardCard title="Overview">
          {projectQuery.isLoading ? (
            <p className="text-sm text-muted">Loading project...</p>
          ) : project ? (
            <div className="space-y-3">
              <ProjectItem
                name={project.name}
                status={project.status}
                tags={project.tags}
                due={project.deadline}
              />
              {project.description ? (
                <p className="text-sm text-muted">{project.description}</p>
              ) : null}
            </div>
          ) : (
            <EmptyState
              title="Project unavailable"
              description="We could not load this project right now."
            />
          )}
        </DashboardCard>

        <DashboardCard title="Quick actions">
          <div className="space-y-3">
            <Link to={`/tasks/create?projectId=${projectId}`}>
              <Button className="w-full">Create task</Button>
            </Link>
            <Button variant="outline" className="w-full">Invite teammate</Button>
            <Link to={`/projects/${projectId ?? ''}/edit`}>
              <Button variant="ghost" className="w-full">Edit project</Button>
            </Link>
            <div className="border-t border-border pt-3">
              {project?.status === 'active' ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleStatusChange('pause')}
                  disabled={pauseMutation.isPending}
                >
                  Pause project
                </Button>
              ) : null}
              {project?.status === 'paused' ? (
                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={() => handleStatusChange('resume')}
                  disabled={resumeMutation.isPending}
                >
                  Resume project
                </Button>
              ) : null}
              {project?.status !== 'completed' ? (
                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={() => handleStatusChange('complete')}
                  disabled={completeMutation.isPending}
                >
                  Mark as complete
                </Button>
              ) : null}
              {project?.status !== 'archived' ? (
                <Button
                  variant="ghost"
                  className="mt-2 w-full"
                  onClick={() => handleStatusChange('archive')}
                  disabled={archiveMutation.isPending}
                >
                  Archive project
                </Button>
              ) : null}
              <label className="mt-3 flex items-start gap-3 rounded-md border border-border bg-base px-3 py-3 text-sm text-secondary">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-border bg-base"
                  checked={deleteConfirmed}
                  onChange={(event) => setDeleteConfirmed(event.target.checked)}
                />
                <span>I understand this will permanently delete the project.</span>
              </label>
              <Button
                className="mt-2 w-full border border-danger bg-danger/10 text-danger hover:bg-danger/20"
                onClick={handleDelete}
                disabled={!deleteConfirmed || deleteMutation.isPending}
              >
                Delete project
              </Button>
            </div>
          </div>
        </DashboardCard>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardCard title="Tasks">
          {tasks.length ? (
            <div className="space-y-2">
              {tasks.map((task) => (
                <TaskItem key={task.title} title={task.title} priority={task.priority} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No tasks yet"
              description="Create tasks to keep the project moving."
              action={<Button variant="primary">Create task</Button>}
            />
          )}
        </DashboardCard>

        <DashboardCard title="Team notes">
          <EmptyState
            title="No updates yet"
            description="Start a discussion for this project."
            action={<Button variant="outline">Add update</Button>}
          />
        </DashboardCard>
      </section>
    </>
  )
}
