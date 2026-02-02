import { useMutation, useQuery } from '@tanstack/react-query'
import type {
  CreateTeamPayload,
  GetTeamByIdResponse,
  GetTeamProjectsResponse,
  GetTeamTasksResponse,
  GetTeamsResponse,
  TeamMemberActionResponse,
  UpdateTeamPayload,
  UpdateTeamResponse,
} from './team.types'
import {
  createTeam,
  deleteTeam,
  demoteTeamMember,
  getTeamById,
  getTeamMembers,
  getTeamProjects,
  getTeamTasks,
  getTeams,
  promoteTeamMember,
  updateTeam,
} from './team.api'

export const useCreateTeam = () => {
  return useMutation({
    mutationFn: (payload: CreateTeamPayload) => createTeam(payload),
  })
}

export const useGetTeams = () => {
  return useQuery<GetTeamsResponse, Error>({
    queryKey: ['teams'],
    queryFn: () => getTeams(),
  })
}

export const useTeamById = (teamId?: string) => {
  return useQuery<GetTeamByIdResponse, Error>({
    queryKey: ['team', teamId],
    queryFn: () => {
      if (!teamId) {
        return Promise.reject(new Error('Missing teamId'))
      }
      return getTeamById({ teamId })
    },
    enabled: Boolean(teamId),
  })
}

export const useTeamProjects = (teamId?: string) => {
  return useQuery<GetTeamProjectsResponse, Error>({
    queryKey: ['team-projects', teamId],
    queryFn: () => {
      if (!teamId) {
        return Promise.reject(new Error('Missing teamId'))
      }
      return getTeamProjects(teamId)
    },
    enabled: Boolean(teamId),
  })
}

export const useTeamTasks = (teamId?: string) => {
  return useQuery<GetTeamTasksResponse, Error>({
    queryKey: ['team-tasks', teamId],
    queryFn: () => {
      if (!teamId) {
        return Promise.reject(new Error('Missing teamId'))
      }
      return getTeamTasks(teamId)
    },
    enabled: Boolean(teamId),
  })
}

export const useTeamMembers = (teamId?: string) => {
  return useQuery<GetTeamByIdResponse, Error>({
    queryKey: ['team-members', teamId],
    queryFn: () => {
      if (!teamId) {
        return Promise.reject(new Error('Missing teamId'))
      }
      return getTeamMembers(teamId)
    },
    enabled: Boolean(teamId),
  })
}

export const usePromoteTeamMember = (teamId: string) => {
  return useMutation<TeamMemberActionResponse, Error, string>({
    mutationFn: (userId) => promoteTeamMember(teamId, userId),
  })
}

export const useDemoteTeamMember = (teamId: string) => {
  return useMutation<TeamMemberActionResponse, Error, string>({
    mutationFn: (userId) => demoteTeamMember(teamId, userId),
  })
}

export const useUpdateTeam = (teamId: string) => {
  return useMutation<UpdateTeamResponse, Error, UpdateTeamPayload>({
    mutationFn: (payload: UpdateTeamPayload) => updateTeam(teamId, payload),
  })
}

export const useDeleteTeam = (teamId: string) => {
  return useMutation<void, Error>({
    mutationFn: () => deleteTeam(teamId)
  })
}
