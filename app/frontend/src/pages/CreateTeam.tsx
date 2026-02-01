import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import InputText from '@/components/InputText'
import PageHeader from '@/components/PageHeader'
import TextArea from '@/components/TextArea'
import { useCreateTeam } from '@/features/team/team.hooks'
import { createTeamSchema, type CreateTeamSchema } from '@/schemas/teams/create-team.schema'
import { toastClient } from '@/utils/toast'

export default function CreateTeam() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const createTeamMutation = useCreateTeam()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CreateTeamSchema>({
    resolver: zodResolver(createTeamSchema),
    mode: 'onChange',
  })

  const handleFormSubmit = handleSubmit((data) => {
    createTeamMutation.mutate(
      {
        name: data.name,
        description: data.description?.trim() || undefined,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['teams'] })
          toastClient.success('Team created successfully')
          navigate('/teams')
        },
        onError: (error) => {
          setError('root', {
            message: error.message || 'Failed to create team. Please try again.',
          })
        },
      }
    )
  })

  return (
    <>
      <section>
        <PageHeader
          title="Create team"
          description="Start a new team to collaborate with teammates."
          action={
            <Button
              variant="outline"
              onClick={() => navigate('/teams')}
            >
              Back to teams
            </Button>
          }
        />
      </section>

      <section className="mt-6">
        <DashboardCard
          title="Team details"
          description="Set the basics so people recognize your team."
        >
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <InputText
              label="Team name"
              placeholder="e.g. Growth Studio"
              {...register('name')}
              error={errors.name?.message}
            />
            <TextArea
              label="Description (optional)"
              placeholder="Describe what this team focuses on..."
              {...register('description')}
              error={errors.description?.message}
            />
            {errors.root ? (
              <p className="text-sm text-danger">{errors.root.message}</p>
            ) : null}
            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/teams')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createTeamMutation.isPending}>
                {createTeamMutation.isPending ? 'Creating...' : 'Create team'}
              </Button>
            </div>
          </form>
        </DashboardCard>
      </section>
    </>
  )
}
