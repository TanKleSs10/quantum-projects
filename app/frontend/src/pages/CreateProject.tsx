import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import InputText from '@/components/InputText'
import PageHeader from '@/components/PageHeader'
import TextArea from '@/components/TextArea'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { createProjectSchema, type CreateProjectSchema } from '@/schemas/projects/create-project.schema'
import { useAuthStore } from '@/store/auth.store'
import { useCreateProject } from '@/features/projects/projects.hooks'
import { toastClient } from '@/utils/toast'
import { useGetTeams } from '@/features/team/team.hooks'

export default function CreateProject() {
  const user = useAuthStore((state) => state.user)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    mode: 'onChange',
  })
  const navigate = useNavigate()
  const createProjectMutation = useCreateProject()
  const { data } = useGetTeams()
  const teams = data?.data ?? []

  const handleFormSubmit = handleSubmit((data) => {
    const tags = data.tags
      ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : []

    createProjectMutation.mutate(
      {
        name: data.name,
        description: data.description?.trim() || undefined,
        tags,
        teamId: data.teamId,
        deadline: data.deadline || undefined,
      },
      {
        onSuccess: () => {
          navigate('/projects')
          toastClient.success('Project created successfully')
        },
        onError: (error) => {
          toastClient.error(error.message || 'Failed to create project. Please try again.')
        },
      }
    )
  })

  return (
    <DashboardLayout
      title="Create project"
      userName={user?.name ?? ''}
      userEmail={user?.email ?? ''}
    >
      <section>
        <PageHeader
          title="Create project"
          description="Set the basics so your team can start working."
          action={(
            <Link to="/projects">
              <Button variant="outline">Back to projects</Button>
            </Link>
          )}
        />
      </section>

      <section className="mt-6">
        <DashboardCard
          title="Project details"
          description="Define the scope and timeline for this project."
        >
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <InputText
              label="Project name"
              placeholder="e.g. Website refresh"
              {...register('name')}
              error={errors.name?.message}
            />
            <TextArea
              label="Description (optional)"
              placeholder="Describe the goals and outcomes..."
              {...register('description')}
              error={errors.description?.message}
            />
            <InputText
              label="Tags (optional)"
              placeholder="e.g. marketing, q2"
              {...register('tags')}
              error={errors.tags?.message}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-secondary" htmlFor="teamId">
                  Team
                </label>
                <select
                  id="teamId"
                  className="w-full rounded-md border border-border bg-base px-3 py-2 text-sm text-main transition-colors duration-150 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                  {...register('teamId')}
                >
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
                {errors.teamId ? (
                  <p className="mt-1 text-sm text-danger">{errors.teamId.message}</p>
                ) : null}
                {!teams.length ? (
                  <p className="mt-2 text-sm text-muted">
                    You don&apos;t have teams yet. Create one before starting a project.
                  </p>
                ) : null}
              </div>
              <InputText
                label="Deadline (optional)"
                type="date"
                {...register('deadline')}
                error={errors.deadline?.message}
              />
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3">
              <Link to="/projects">
                <Button type="button" variant="ghost">Cancel</Button>
              </Link>
              <Button type="submit" disabled={!teams.length}>
                Create project
              </Button>
            </div>
          </form>
        </DashboardCard>
      </section>
    </DashboardLayout>
  )
}
