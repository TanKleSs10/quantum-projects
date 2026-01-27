import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import InputText from '@/components/InputText'
import PageHeader from '@/components/PageHeader'
import TextArea from '@/components/TextArea'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { useProjectById, useUpdateProject } from '@/features/projects/projects.hooks'
import { useGetTeams } from '@/features/team/team.hooks'
import { updateProjectSchema, type UpdateProjectSchema } from '@/schemas/projects/update-project.schema'
import { useAuthStore } from '@/store/auth.store'
import { toastClient } from '@/utils/toast'

export default function EditProject() {
  const { projectId } = useParams()
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const { data: teamsData } = useGetTeams()
  const teams = teamsData?.data ?? []
  const projectQuery = useProjectById(projectId)
  const updateProjectMutation = useUpdateProject(projectId ?? '')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProjectSchema>({
    resolver: zodResolver(updateProjectSchema),
    mode: 'onChange',
  })

  useEffect(() => {
    if (!projectQuery.data?.data) {
      return
    }

    const project = projectQuery.data.data
    reset({
      name: project.name,
      description: project.description ?? '',
      tags: project.tags?.join(', ') ?? '',
      deadline: project.deadline ?? '',
      teamId: project.teamId,
    })
  }, [projectQuery.data, reset])

  const handleFormSubmit = handleSubmit((data) => {
    const tags = data.tags
      ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : []

    updateProjectMutation.mutate(
      {
        name: data.name,
        description: data.description?.trim() || undefined,
        tags,
        deadline: data.deadline || undefined,
        teamId: data.teamId,
      },
      {
        onSuccess: () => {
          toastClient.success('Project updated successfully')
          navigate(`/projects/${projectId}`)
        },
        onError: (error) => {
          toastClient.error(error.message || 'Failed to update project')
        },
      }
    )
  })

  return (
    <DashboardLayout
      title="Edit project"
      userName={user?.name ?? ''}
      userEmail={user?.email ?? ''}
    >
      <section>
        <PageHeader
          title="Edit project"
          description="Update the project details and timeline."
          action={(
            <Link to={`/projects/${projectId ?? ''}`}>
              <Button variant="outline">Back to project</Button>
            </Link>
          )}
        />
      </section>

      <section className="mt-6">
        <DashboardCard
          title="Project details"
          description="Keep the scope and dates up to date."
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
              </div>
              <InputText
                label="Deadline (optional)"
                type="date"
                {...register('deadline')}
                error={errors.deadline?.message}
              />
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3">
              <Link to={`/projects/${projectId ?? ''}`}>
                <Button type="button" variant="ghost">Cancel</Button>
              </Link>
              <Button type="submit" disabled={updateProjectMutation.isPending}>
                {updateProjectMutation.isPending ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </DashboardCard>
      </section>
    </DashboardLayout>
  )
}
