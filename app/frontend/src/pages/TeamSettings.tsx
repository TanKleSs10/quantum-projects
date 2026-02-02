import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import InputText from '@/components/InputText'
import PageHeader from '@/components/PageHeader'
import TextArea from '@/components/TextArea'
import { useTeamById, useUpdateTeam } from '@/features/team/team.hooks'
import { updateTeamSchema, type UpdateTeamSchema } from '@/schemas/teams/update-team.schema'
import { toastClient } from '@/utils/toast'

export default function TeamSettings() {
  const { teamId } = useParams()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateTeamSchema>({
    resolver: zodResolver(updateTeamSchema),
    mode: 'onChange',
  })

  const teamQuery = useTeamById(teamId)
  const updateTeamMutation = useUpdateTeam(teamId ?? '')

  useEffect(() => {
    if (!teamQuery.data?.data) {
      return
    }

    const team = teamQuery.data.data
    reset({
      name: team.name,
      description: team.description ?? '',
    })
  }, [reset, teamQuery.data])

  const handleFormSubmit = handleSubmit((data) => {
    if (!teamId) {
      return
    }

    updateTeamMutation.mutate(
      {
        name: data.name,
        description: data.description?.trim() || undefined,
      },
      {
        onSuccess: () => {
          toastClient.success('Team updated successfully')
          navigate(`/teams/${teamId}`)
        },
        onError: (error) => {
          toastClient.error(error.message || 'Failed to update team')
        },
      }
    )
  })

  if (!teamId) {
    return (
      <p className="text-sm text-muted">Team not found.</p>
    )
  }

  return (
    <>
      <section>
        <PageHeader
          title="Team settings"
          description="Update the name and description of your team."
          action={(
            <Link to={`/teams/${teamId}`}>
              <Button variant="outline">Back to team</Button>
            </Link>
          )}
        />
      </section>

      <section className="mt-6">
        <DashboardCard
          title="Team details"
          description="Keep the basics up to date for your collaborators."
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
            <div className="flex flex-wrap items-center justify-end gap-3">
              <Link to={`/teams/${teamId}`}>
                <Button type="button" variant="ghost">Cancel</Button>
              </Link>
              <Button type="submit" disabled={updateTeamMutation.isPending}>
                {updateTeamMutation.isPending ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </DashboardCard>
      </section>
    </>
  )
}
