import { useNavigate } from 'react-router'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import EmptyState from '@/components/EmptyState'
import PageHeader from '@/components/PageHeader'
import TeamList from '@/components/TeamList'
import { useGetTeams } from '@/features/team/team.hooks'

export default function Teams() {
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useGetTeams()
  const teams = (data?.data ?? []).map((team) => ({
    id: team.id,
    name: team.name,
    description: team.description,
    membersCount: team.members.length,
    href: `/teams/${team.id}`,
  }))

  return (
    <>
      <section>
        <PageHeader
          title="Teams"
          description="Create and manage collaboration spaces for your projects."
          action={<Button variant="primary" onClick={() => navigate('/teams/create')}>+ Create team</Button>}
        />
      </section>

      <section className="mt-6">
        <DashboardCard
          title="Your teams"
          description="Teams you currently belong to."
        >
          {isLoading ? (
            <p className="text-sm text-muted">Loading teams...</p>
          ) : isError ? (
            <EmptyState
              title="Unable to load teams"
              description="Try again in a moment."
              action={
                <Button variant="outline" onClick={() => refetch()}>
                  Retry
                </Button>
              }
            />
          ) : (
            <TeamList
              teams={teams}
              emptyAction={
                <Button variant="primary" onClick={() => navigate('/teams/create')}>
                  Create team
                </Button>
              }
            />
          )}
        </DashboardCard>
      </section>
    </>
  )
}
