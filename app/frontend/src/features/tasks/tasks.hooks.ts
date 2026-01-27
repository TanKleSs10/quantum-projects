import { useMutation, useQuery } from '@tanstack/react-query'
import type {
  AssignTaskPayload,
  ChangeTaskStatusPayload,
  CreateTaskPayload,
  ListTasksByProjectParams,
  UpdateTaskPayload,
} from '@/features/tasks/tasks.types'
import {
  assignTask,
  changeTaskStatus,
  createTask,
  getTaskById,
  getTasksByProject,
  getTasksByUser,
  updateTask,
} from '@/features/tasks/tasks.api'

export const useCreateTask = (projectId: string) => {
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(projectId, payload),
  })
}

export const useTasksByProject = (
  projectId?: string,
  filters: ListTasksByProjectParams = {}
) => {
  return useQuery({
    queryKey: ['tasks', projectId, filters],
    queryFn: () => {
      if (!projectId) {
        return Promise.reject(new Error('Missing projectId'))
      }
      return getTasksByProject(projectId, filters)
    },
    enabled: Boolean(projectId),
  })
}

export const useTaskByUser = () => {
  return useQuery({
    queryKey: ['tasks', 'user'],
    queryFn: () => {
      return getTasksByProject('user')
    },
  })
}

export const useTasksByUser = () => {
  return useQuery({
    queryKey: ['tasks', 'user'],
    queryFn: () => getTasksByUser(),
  })
}

export const useTaskById = (taskId?: string) => {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () => {
      if (!taskId) {
        return Promise.reject(new Error('Missing taskId'))
      }
      return getTaskById(taskId)
    },
    enabled: Boolean(taskId),
  })
}

export const useUpdateTask = (taskId: string) => {
  return useMutation({
    mutationFn: (payload: UpdateTaskPayload) => updateTask(taskId, payload),
  })
}

export const useChangeTaskStatus = (taskId: string) => {
  return useMutation({
    mutationFn: (payload: ChangeTaskStatusPayload) => changeTaskStatus(taskId, payload),
  })
}

export const useAssignTask = (taskId: string) => {
  return useMutation({
    mutationFn: (payload: AssignTaskPayload) => assignTask(taskId, payload),
  })
}
