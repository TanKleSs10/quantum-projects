export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export type Task = {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId?: string
  dueDate?: string
  tags: string[]
  projectId: string
  createdAt: string
  updatedAt: string
}

export type CreateTaskPayload = {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  assigneeId?: string
  dueDate?: string
  tags?: string[]
}

export type UpdateTaskPayload = {
  title?: string
  description?: string
  priority?: TaskPriority
  dueDate?: string
  tags?: string[]
}

export type ChangeTaskStatusPayload = {
  status: TaskStatus
}

export type AssignTaskPayload = {
  assigneeId: string
}

export type ListTasksByProjectParams = {
  status?: TaskStatus
  priority?: TaskPriority
  assigneeId?: string
}

export type TaskResponse = {
  success: boolean
  data: Task
}

export type TaskListResponse = {
  success: boolean
  data: Task[]
}
