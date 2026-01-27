import { useMutation, useQuery } from '@tanstack/react-query'
import type {
  CreateTeamPayload,
  GetTeamByIdResponse,
  GetTeamProjectsResponse,
  GetTeamTasksResponse,
  GetTeamsResponse,
} from './team.types'
import { createTeam, getTeamById, getTeamProjects, getTeamTasks, getTeams } from './team.api'

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
