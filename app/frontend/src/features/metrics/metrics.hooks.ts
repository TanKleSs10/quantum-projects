import { useQuery } from '@tanstack/react-query'
import {
  getMetricsOverview,
  getProjectMetrics,
  getTaskMetrics,
  getTeamMetrics,
} from './metrics.api'
import type {
  MetricsOverviewResponse,
  ProjectMetricsResponse,
  TaskMetricsResponse,
  TeamMetricsResponse,
} from './metrics.types'

export const useMetricsOverview = () => {
  return useQuery<MetricsOverviewResponse, Error>({
    queryKey: ['metrics', 'overview'],
    queryFn: () => getMetricsOverview(),
  })
}

export const useProjectMetrics = () => {
  return useQuery<ProjectMetricsResponse, Error>({
    queryKey: ['metrics', 'projects'],
    queryFn: () => getProjectMetrics(),
  })
}

export const useTaskMetrics = () => {
  return useQuery<TaskMetricsResponse, Error>({
    queryKey: ['metrics', 'tasks'],
    queryFn: () => getTaskMetrics(),
  })
}

export const useTeamMetrics = () => {
  return useQuery<TeamMetricsResponse, Error>({
    queryKey: ['metrics', 'teams'],
    queryFn: () => getTeamMetrics(),
  })
}
