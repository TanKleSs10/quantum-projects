import { apiRequest } from '@/api/client'
import type {
  CreateTeamPayload,
  CreateTeamResponse,
  GetTeamByIdPayload,
  GetTeamByIdResponse,
  GetTeamProjectsResponse,
  GetTeamTasksResponse,
  GetTeamsResponse,
} from './team.types'

export function createTeam(payload: CreateTeamPayload) {
  return apiRequest<CreateTeamResponse>('/teams', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getTeams() {
  return apiRequest<GetTeamsResponse>('/teams', {
    method: 'GET',
  })
}

export function getTeamById(payload: GetTeamByIdPayload) {
  return apiRequest<GetTeamByIdResponse>(`/teams/${payload.teamId}?include=members`, {
    method: 'GET',
  })
}

export function getTeamProjects(teamId: string) {
  return apiRequest<GetTeamProjectsResponse>(`/teams/${teamId}/projects`, {
    method: 'GET',
  })
}

export function getTeamTasks(teamId: string) {
  return apiRequest<GetTeamTasksResponse>(`/teams/${teamId}/tasks`, {
    method: 'GET',
  })
}
