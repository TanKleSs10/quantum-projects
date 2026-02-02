import { apiRequest } from '@/api/client'
import type {
  CreateTeamPayload,
  CreateTeamResponse,
  GetTeamByIdPayload,
  GetTeamByIdResponse,
  GetTeamProjectsResponse,
  GetTeamTasksResponse,
  GetTeamsResponse,
  TeamMemberActionResponse,
  UpdateTeamPayload,
  UpdateTeamResponse,
} from './team.types'

export function createTeam(payload: CreateTeamPayload) {
  return apiRequest<CreateTeamResponse>('/teams', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getTeams() {
  return apiRequest<GetTeamsResponse>('/me/teams', {
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

export function getTeamMembers(teamId: string) {
  return apiRequest<GetTeamByIdResponse>(`/teams/${teamId}/members`, {
    method: 'GET',
  })
}

export function promoteTeamMember(teamId: string, userId: string) {
  return apiRequest<TeamMemberActionResponse>(`/teams/${teamId}/members/${userId}/promote`, {
    method: 'PATCH',
  })
}

export function demoteTeamMember(teamId: string, userId: string) {
  return apiRequest<TeamMemberActionResponse>(`/teams/${teamId}/members/${userId}/demote`, {
    method: 'PATCH',
  })
}

export function updateTeam(teamId: string, payload: UpdateTeamPayload) {
  return apiRequest<UpdateTeamResponse>(`/teams/${teamId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function deleteTeam(teamId: string) {
  return apiRequest<void>(`/teams/${teamId}`, {
    method: 'DELETE',
  })
}
