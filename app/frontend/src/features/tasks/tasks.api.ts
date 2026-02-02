import { apiRequest } from '@/api/client'
import type {
  AssignTaskPayload,
  ChangeTaskStatusPayload,
  CreateTaskPayload,
  ListTasksByProjectParams,
  TaskListResponse,
  TaskResponse,
  UpdateTaskPayload,
} from '@/features/tasks/tasks.types'

export function createTask(projectId: string, payload: CreateTaskPayload) {
  return apiRequest<TaskResponse>(`/projects/${projectId}/tasks`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getTasksByProject(projectId: string) {
  return apiRequest<TaskListResponse>(`/projects/${projectId}/tasks`, {
    method: 'GET',
  })
}

export function getTaskById(taskId: string) {
  return apiRequest<TaskResponse>(`/tasks/${taskId}`, {
    method: 'GET',
  })
}

export function getTasksByUser() {
  return apiRequest<TaskListResponse>('/me/tasks', {
    method: 'GET',
  })
}

export function updateTask(taskId: string, payload: UpdateTaskPayload) {
  return apiRequest<TaskResponse>(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function changeTaskStatus(taskId: string, payload: ChangeTaskStatusPayload) {
  return apiRequest<TaskResponse>(`/tasks/${taskId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function assignTask(taskId: string, payload: AssignTaskPayload) {
  return apiRequest<TaskResponse>(`/tasks/${taskId}/assign`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}
