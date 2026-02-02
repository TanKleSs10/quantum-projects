import { apiRequest } from '@/api/client'
import type {
  MetricsOverviewResponse,
  ProjectMetricsResponse,
  TaskMetricsResponse,
  TeamMetricsResponse,
} from './metrics.types'

export function getMetricsOverview() {
  return apiRequest<MetricsOverviewResponse>('/metrics/overview', {
    method: 'GET',
  })
}

export function getProjectMetrics() {
  return apiRequest<ProjectMetricsResponse>('/metrics/projects', {
    method: 'GET',
  })
}

export function getTaskMetrics() {
  return apiRequest<TaskMetricsResponse>('/metrics/tasks', {
    method: 'GET',
  })
}

export function getTeamMetrics() {
  return apiRequest<TeamMetricsResponse>('/metrics/teams', {
    method: 'GET',
  })
}
