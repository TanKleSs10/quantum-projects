import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import InputText from '@/components/InputText'
import PageHeader from '@/components/PageHeader'
import TextArea from '@/components/TextArea'
import { createProjectSchema, type CreateProjectSchema } from '@/schemas/projects/create-project.schema'
import { useCreateProject } from '@/features/projects/projects.hooks'
import { useTeamById } from '@/features/team/team.hooks'
import { useLayoutStore } from '@/store/layout.store'
import { toastClient } from '@/utils/toast'

export default function CreateProject() {
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
  const teamId = useParams().teamId
  const teamQuery = useTeamById(teamId)
  const setPageTitle = useLayoutStore((state) => state.setPageTitle)

  useEffect(() => {
    const teamName = teamQuery.data?.data?.name
    if (teamName) {
      setPageTitle(`Create project - ${teamName}`)
    } else {
      setPageTitle('Create project')
    }

    return () => setPageTitle(null)
  }, [setPageTitle, teamQuery.data?.data?.name])

  const handleFormSubmit = handleSubmit((data) => {
    const tags = data.tags
      ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : []
    createProjectMutation.mutate(
      {
        name: data.name,
        description: data.description?.trim() || undefined,
        tags,
        teamId: teamId || '',
        deadline: data.deadline || undefined,
      },
      {
        onSuccess: () => {
          navigate(`/team/${teamId}`)
          toastClient.success('Project created successfully')
        },
        onError: (error) => {
          toastClient.error(error.message || 'Failed to create project. Please try again.')
        },
      }
    )
  })

  return (
    <>
      <section>
        <PageHeader
          title="Create project"
          description="Set the basics so your team can start working."
          action={(
            <Link to={`/teams/${teamId}`}>
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
            <InputText
              label="Deadline (optional)"
              type="date"
              {...register('deadline')}
              error={errors.deadline?.message}
            />
            <div className="flex flex-wrap items-center justify-end gap-3">
              <Link to={`/teams/${teamId}`}>
                <Button type="button" variant="ghost">Cancel</Button>
              </Link>
              <Button type="submit" variant="primary">
                Create project
              </Button>
            </div>
          </form>
        </DashboardCard>
      </section>
    </>
  )
}
