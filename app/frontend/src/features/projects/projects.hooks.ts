import { useMutation, useQuery } from '@tanstack/react-query'
import type {
  CreateProjectPayload,
  UpdateProjectPayload,
} from '@/features/projects/projects.types'
import {
  archiveProject,
  completeProject,
  createProject,
  deleteProject,
  getProjectById,
  getProjectsByTeamId,
  getProjectsByUser,
  pauseProject,
  reopenProject,
  updateProject,
} from '@/features/projects/projects.api'
import type { GetProjectsResponse } from '@/features/projects/projects.types'

export const useCreateProject = () => {
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
  })
}

export const useProjectsByTeam = (teamId?: string) => {
  return useQuery({
    queryKey: ['projects', teamId],
    queryFn: () => {
      if (!teamId) {
        return Promise.reject(new Error('Missing teamId'))
      }
      return getProjectsByTeamId(teamId)
    },
    enabled: Boolean(teamId),
  })
}

export const useProjectById = (projectId?: string) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => {
      if (!projectId) {
        return Promise.reject(new Error('Missing projectId'))
      }
      return getProjectById(projectId)
    },
    enabled: Boolean(projectId),
  })
}

export const useUpdateProject = (projectId: string) => {
  return useMutation({
    mutationFn: (payload: UpdateProjectPayload) => updateProject(projectId, payload),
  })
}

export const usePauseProject = (projectId: string) => {
  return useMutation({
    mutationFn: () => pauseProject(projectId),
  })
}

export const useCompleteProject = (projectId: string) => {
  return useMutation({
    mutationFn: () => completeProject(projectId),
  })
}

export const useArchiveProject = (projectId: string) => {
  return useMutation({
    mutationFn: () => archiveProject(projectId),
  })
}

export const useReopenProject = (projectId: string) => {
  return useMutation({
    mutationFn: () => reopenProject(projectId),
  })
}

export const useDeleteProject = (projectId: string) => {
  return useMutation({
    mutationFn: () => deleteProject(projectId),
  })
}

export const useGetProjectsByUser = () => {
  return useQuery<GetProjectsResponse, Error>({
    queryKey: ['projects', 'user'],
    queryFn: () => getProjectsByUser(),
  })
}
