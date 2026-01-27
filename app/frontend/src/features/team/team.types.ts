import type { Project } from '@/features/projects/projects.types'
import type { Task } from '@/features/tasks/tasks.types'
import type { User } from '@/features/user/user.types'

export type TeamMemberRole = 'owner' | 'admin' | 'member'

export type TeamMemberUser = Pick<User, 'id' | 'name' | 'email'>

export type TeamMember = {
  userId: string
  role: TeamMemberRole
  user?: TeamMemberUser
}
export type Team = {
  id: string
  name: string
  ownerId: string
  description?: string
  members: TeamMember[]
  createdAt: string
  updatedAt: string
}


export type CreateTeamPayload = {
  name: string
  description?: string
}

export type CreateTeamResponse = {
  success: boolean
  data: Team
}

export type GetTeamsResponse = {
  success: boolean
  data: Team[]
}

export type GetTeamByIdPayload = {
  teamId: string
}

export type GetTeamByIdResponse = {
  success: boolean
  data: Team
}

export type GetTeamProjectsResponse = {
  success: boolean
  data: Project[]
}

export type GetTeamTasksResponse = {
  success: boolean
  data: Task[]
}
