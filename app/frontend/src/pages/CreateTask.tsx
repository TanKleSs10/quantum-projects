import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import InputText from '@/components/InputText'
import PageHeader from '@/components/PageHeader'
import TextArea from '@/components/TextArea'
import { useCreateTask } from '@/features/tasks/tasks.hooks'
import { useGetTeams, useTeamById, useTeamProjects } from '@/features/team/team.hooks'
import { createTaskSchema, type CreateTaskSchema } from '@/schemas/tasks/create-task.schema'
import { toastClient } from '@/utils/toast'
import type { Team } from '@/features/team/team.types'

export default function CreateTask() {
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState('')

  const path = useLocation().search;
  const projectIdFromQuery = new URLSearchParams(path).get('projectId');


  const { data: teamsData } = useGetTeams()
  const teams: Team[] = teamsData?.data ?? []

  const {
    data: projectsData,
    isError: isProjectsError,
    isLoading: isProjectsLoading,
  } = useTeamProjects(projectIdFromQuery ?? selectedTeamId)

  const projects = projectsData?.data ?? []

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    mode: 'onChange',
  })


  // const activeTeamId = selectedTeamId || teams[0]?.id

  //   const { data: teamData } = useTeamById(activeTeamId)
  // const teamMembers = teamData?.data.members ?? []
  // const selectedProjectId = watch('projectId')

  const createTaskMutation = useCreateTask(selectedProjectId || '')

  // useEffect(() => {
  //   if (!selectedTeamId && teams[0]?.id) {
  //     setSelectedTeamId(teams[0].id)
  //   }
  // }, [selectedTeamId, teams])

  const handleTeamChange = (value: string) => {
    setSelectedTeamId(value)
    setValue('projectId', '')
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
          navigate('/tasks')
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
          description="Add a new task to track work across your team."
          action={(
            <Link to="/tasks">
              <Button variant="outline">Back to tasks</Button>
            </Link>
          )}
        />
      </section>

      <section className="mt-6">
        <DashboardCard
          title="Task details"
          description="Set scope, status, and ownership."
        >
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <InputText
              label="Title"
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
                <label className="mb-1.5 block text-sm font-medium text-secondary" htmlFor="teamId">
                  Team
                </label>
                <select
                  id="teamId"
                  className="w-full rounded-md border border-border bg-base px-3 py-2 text-sm text-main transition-colors duration-150 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                  value={selectedTeamId ?? ''}
                  onChange={(event) => handleTeamChange(event.target.value)}
                >
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
                {!teams.length ? (
                  <p className="mt-2 text-sm text-muted">
                    You don&apos;t have teams yet. Create one before adding tasks.
                  </p>
                ) : null}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-secondary" htmlFor="projectId">
                  Project
                </label>
                <select
                  id="projectId"
                  value={selectedProjectId ?? ''}
                  className="w-full rounded-md border border-border bg-base px-3 py-2 text-sm text-main transition-colors duration-150 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                  {...register('projectId')}
                >
                  <option value="">Select a project</option>
                  {isProjectsLoading ? (
                    <option value="" disabled>Loading projects...</option>
                  ) : null}
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
                {errors.projectId ? (
                  <p className="mt-1 text-sm text-danger">{errors.projectId.message}</p>
                ) : null}
                {isProjectsError ? (
                  <p className="mt-2 text-sm text-danger">
                    Unable to load projects for this team.
                  </p>
                ) : null}
                {activeTeamId && !projects.length ? (
                  <p className="mt-2 text-sm text-muted">
                    This team doesn&apos;t have projects yet. Create one to add tasks.
                  </p>
                ) : null}
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
                  <option value="">Unassigned</option>
                  {teamMembers.map((member) => (
                    <option key={member.userId} value={member.userId}>
                      {member.user?.name ?? member.userId}
                    </option>
                  ))}
                </select>
              </div>
            </div>
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
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <InputText
                label="Due date (optional)"
                type="date"
                {...register('dueDate')}
                error={errors.dueDate?.message}
              />
              <InputText
                label="Tags (optional)"
                placeholder="e.g. onboarding, q2"
                {...register('tags')}
                error={errors.tags?.message}
              />
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3">
              <Link to="/tasks">
                <Button type="button" variant="ghost">Cancel</Button>
              </Link>
              <Button type="submit" disabled={!projects.length}>
                Create task
              </Button>
            </div>
          </form>
        </DashboardCard>
      </section>
    </>
  )
}
