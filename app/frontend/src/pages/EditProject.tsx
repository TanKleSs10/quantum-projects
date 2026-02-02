import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import InputText from '@/components/InputText'
import PageHeader from '@/components/PageHeader'
import TextArea from '@/components/TextArea'
import { useProjectById, useUpdateProject } from '@/features/projects/projects.hooks'
import { updateProjectSchema, type UpdateProjectSchema } from '@/schemas/projects/update-project.schema'
import { useLayoutStore } from '@/store/layout.store'
import { toastClient } from '@/utils/toast'

export default function EditProject() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const projectQuery = useProjectById(projectId)
  const updateProjectMutation = useUpdateProject(projectId ?? '')
  const setPageTitle = useLayoutStore((state) => state.setPageTitle)

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
    })
  }, [projectQuery.data, reset])

  useEffect(() => {
    const projectName = projectQuery.data?.data?.name
    setPageTitle(projectName ? `Edit project - ${projectName}` : 'Edit project')
    return () => setPageTitle(null)
  }, [projectQuery.data?.data?.name, setPageTitle])

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
    <>
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
            <InputText
              label="Deadline (optional)"
              type="date"
              {...register('deadline')}
              error={errors.deadline?.message}
            />
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
    </>
  )
}
