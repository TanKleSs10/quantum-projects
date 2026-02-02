export type MetricsOverview = {
  project: {
    desc: string
    totalCount: number
    status: {
      active: number
      paused: number
      completed: number
      archived: number
    }
    overdue: number
  }
  task: {
    desc: string
    totalCount: number
    status: {
      todo: number
      inProgress: number
      blocked: number
      done: number
    }
    priority: {
      low: number
      medium: number
      high: number
      urgent: number
    }
    overdue: number
  }
  team: {
    desc: string
    totalCount: number
  }
}

export type MetricsOverviewResponse = {
  success: boolean
  data: MetricsOverview
}

export type ProjectMetrics = {
  projectId: string
  name: string
  status: string
  tasks: {
    total: number
    todo: number
    in_progress: number
    blocked: number
    done: number
  }
  progress: number
}

export type ProjectMetricsResponse = {
  success: boolean
  data: ProjectMetrics[]
}

export type TaskMetrics = {
  total: number
  byStatus: {
    todo: number
    in_progress: number
    blocked: number
    done: number
  }
  overdue: number
}

export type TaskMetricsResponse = {
  success: boolean
  data: TaskMetrics
}

export type TeamMetrics = {
  teamId: string
  name: string
  membersCount: number
  projects: {
    total: number
    active: number
  }
}

export type TeamMetricsResponse = {
  success: boolean
  data: TeamMetrics[]
}
