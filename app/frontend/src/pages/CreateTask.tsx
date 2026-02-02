import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import EmptyState from '@/components/EmptyState'
import InputText from '@/components/InputText'
import PageHeader from '@/components/PageHeader'
import TextArea from '@/components/TextArea'
import { useProjectById } from '@/features/projects/projects.hooks'
import { useCreateTask } from '@/features/tasks/tasks.hooks'
import { useTeamById } from '@/features/team/team.hooks'
import { createTaskSchema, type CreateTaskSchema } from '@/schemas/tasks/create-task.schema'
import { useLayoutStore } from '@/store/layout.store'
import { toastClient } from '@/utils/toast'

export default function CreateTask() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const setPageTitle = useLayoutStore((state) => state.setPageTitle)

  const projectQuery = useProjectById(projectId)
  const project = projectQuery.data?.data
  const teamQuery = useTeamById(project?.teamId)
  const members = teamQuery.data?.data.members ?? []
  const hasMembers = members.length > 0

  const createTaskMutation = useCreateTask(projectId ?? '')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    mode: 'onChange',
  })

  useEffect(() => {
    setPageTitle(project?.name ? `Create task - ${project.name}` : 'Create task')
    return () => setPageTitle(null)
  }, [project?.name, setPageTitle])

  if (!projectId) {
    return (
      <EmptyState
        title="Project not found"
        description="Select a project before creating a task."
      />
    )
  }

  const handleFormSubmit = handleSubmit((data) => {
    const tags = data.tags
      ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : []

    createTaskMutation.mutate(
      {
        title: data.title,
        description: data.description?.trim() || undefined,
        status: data.status,
        priority: data.priority,
        assigneeId: data.assigneeId || undefined,
        dueDate: data.dueDate || undefined,
        tags,
      },
      {
        onSuccess: () => {
          navigate(`/projects/${projectId}`)
          toastClient.success('Task created successfully')
        },
        onError: (error) => {
          toastClient.error(error.message || 'Failed to create task. Please try again.')
        },
      }
    )
  })

  return (
    <>
      <section>
        <PageHeader
          title="Create task"
          description="Add a new task to keep the project on track."
          action={(
            <Link to={`/projects/${projectId}`}>
              <Button variant="outline">Back to project</Button>
            </Link>
          )}
        />
      </section>

      <section className="mt-6">
        <DashboardCard
          title="Task details"
          description={project?.name ? `Project: ${project.name}` : 'Set scope, status, and ownership.'}
        >
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <InputText
              label="Task title"
              placeholder="e.g. Prepare kickoff brief"
              {...register('title')}
              error={errors.title?.message}
            />
            <TextArea
              label="Description (optional)"
              placeholder="Provide additional context..."
              {...register('description')}
              error={errors.description?.message}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-secondary" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  className="w-full rounded-md border border-border bg-base px-3 py-2 text-sm text-main transition-colors duration-150 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                  {...register('status')}
                >
                  <option value="">Select status</option>
                  <option value="todo">To do</option>
                  <option value="in_progress">In progress</option>
                  <option value="blocked">Blocked</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-secondary" htmlFor="priority">
                  Priority
                </label>
                <select
                  id="priority"
                  className="w-full rounded-md border border-border bg-base px-3 py-2 text-sm text-main transition-colors duration-150 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                  {...register('priority')}
                >
                  <option value="">Select priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-secondary" htmlFor="dueDate">
                  Due date (optional)
                </label>
                <InputText
                  id="dueDate"
                  type="date"
                  {...register('dueDate')}
                  error={errors.dueDate?.message}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-secondary" htmlFor="assigneeId">
                  Assignee (optional)
                </label>
                <select
                  id="assigneeId"
                  className="w-full rounded-md border border-border bg-base px-3 py-2 text-sm text-main transition-colors duration-150 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                  {...register('assigneeId')}
                >
                  <option value="">Select assignee</option>
                  {teamQuery.isLoading ? (
                    <option value="" disabled>Loading members...</option>
                  ) : null}
                  {members.map((member) => (
                    <option key={member.userId} value={member.userId}>
                      {member.user?.name ?? member.userId}
                    </option>
                  ))}
                </select>
                {errors.assigneeId ? (
                  <p className="mt-2 text-sm text-danger">{errors.assigneeId.message}</p>
                ) : null}
                {teamQuery.isError ? (
                  <p className="mt-2 text-sm text-danger">Unable to load team members.</p>
                ) : null}
                {!teamQuery.isLoading && !hasMembers ? (
                  <p className="mt-2 text-sm text-danger">Team members are required to assign this task.</p>
                ) : null}
              </div>
            </div>

            <InputText
              label="Tags (optional)"
              placeholder="e.g. onboarding, q2"
              {...register('tags')}
              error={errors.tags?.message}
            />

            <div className="flex flex-wrap items-center justify-end gap-3">
              <Link to={`/projects/${projectId}`}>
                <Button type="button" variant="ghost">Cancel</Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                disabled={createTaskMutation.isPending || !hasMembers}
              >
                {createTaskMutation.isPending ? 'Creating...' : 'Create task'}
              </Button>
            </div>
          </form>
        </DashboardCard>
      </section>
    </>
  )
}
