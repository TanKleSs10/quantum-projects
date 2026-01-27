import type { ReactNode } from 'react'
import EmptyState from '@/components/EmptyState'
import TeamItem from '@/components/TeamItem'

type Team = {
  id: string
  name: string
  description?: string
  membersCount: number
  projectsCount?: number
  href?: string
}

type TeamListProps = {
  teams: Team[]
  emptyAction?: ReactNode
}

export default function TeamList({ teams, emptyAction }: TeamListProps) {
  if (!teams.length) {
    return (
      <EmptyState
        title="No teams yet"
        description="Create a team to start collaborating with others."
        action={emptyAction}
      />
    )
  }

  return (
    <div className="space-y-3">
      {teams.map((team) => (
        <TeamItem
          key={team.id}
          name={team.name}
          description={team.description}
          membersCount={team.membersCount}
          projectsCount={team.projectsCount}
          href={team.href}
        />
      ))}
    </div>
  )
}
