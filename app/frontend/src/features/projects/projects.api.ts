import { apiRequest } from '@/api/client'
import type {
  CreateProjectPayload,
  CreateProjectResponse,
  DeleteProjectResponse,
  GetProjectResponse,
  GetProjectsResponse,
  UpdateProjectPayload,
} from '@/features/projects/projects.types'

export function createProject(payload: CreateProjectPayload) {
  return apiRequest<CreateProjectResponse>('/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getProjectsByTeamId(teamId: string) {
  return apiRequest<GetProjectsResponse>(`/projects?teamId=${teamId}`, {
    method: 'GET',
  })
}

// TODO: Rename from getProjectsByUser to getMyProjects for clarity
export function getProjectsByUser() {
  return apiRequest<GetProjectsResponse>('/users/me/projects', {
    method: 'GET',
  })
}

export function getProjectById(projectId: string) {
  return apiRequest<GetProjectResponse>(`/projects/${projectId}`, {
    method: 'GET',
  })
}

export function updateProject(projectId: string, payload: UpdateProjectPayload) {
  return apiRequest<GetProjectResponse>(`/projects/${projectId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function pauseProject(projectId: string) {
  return apiRequest<GetProjectResponse>(`/projects/${projectId}/pause`, {
    method: 'PATCH',
  })
}

export function resumeProject(projectId: string) {
  return apiRequest<GetProjectResponse>(`/projects/${projectId}/resume`, {
    method: 'PATCH',
  })
}

export function completeProject(projectId: string) {
  return apiRequest<GetProjectResponse>(`/projects/${projectId}/complete`, {
    method: 'PATCH',
  })
}

export function archiveProject(projectId: string) {
  return apiRequest<GetProjectResponse>(`/projects/${projectId}/archive`, {
    method: 'PATCH',
  })
}

export function deleteProject(projectId: string) {
  return apiRequest<DeleteProjectResponse>(`/projects/${projectId}`, {
    method: 'DELETE',
  })
}
