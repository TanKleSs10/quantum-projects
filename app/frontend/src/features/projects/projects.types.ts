export type ProjectStatus = 'active' | 'paused' | 'completed'

export type Project = {
  id: string
  name: string
  teamId: string
  createdBy: string
  status: ProjectStatus
  archived: boolean
  description?: string
  tags: string[]
  deadline?: string
}

export type CreateProjectPayload = {
  name: string
  description?: string
  tags?: string[]
  deadline?: string
  teamId: string
}

export type UpdateProjectPayload = {
  name?: string
  description?: string
  tags?: string[]
  deadline?: string
}

export type CreateProjectResponse = {
  success: boolean
  data: Project
}

export type GetProjectsResponse = {
  success: boolean
  data: Project[]
}

export type GetProjectResponse = {
  success: boolean
  data: Project
}

export type DeleteProjectResponse = {
  success: boolean
  message: string
}
