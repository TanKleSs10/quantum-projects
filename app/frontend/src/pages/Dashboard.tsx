import ActivityItem from '@/components/ActivityItem'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import EmptyState from '@/components/EmptyState'
import MetricCard from '@/components/MetricCard'
import ProjectItem from '@/components/ProjectItem'
import { useMetricsOverview, useTaskMetrics } from '@/features/metrics/metrics.hooks'
import { useGetProjectsByUser } from '@/features/projects/projects.hooks'
import { useTasksByUser } from '@/features/tasks/tasks.hooks'
import { useAuthStore } from '@/store/auth.store'
import { formatDate } from '@/utils/format-date'
import { useNavigate } from 'react-router'

export default function Dashboard() {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  const overviewQuery = useMetricsOverview()
  const taskMetricsQuery = useTaskMetrics()
  const projectsQuery = useGetProjectsByUser()
  const tasksQuery = useTasksByUser()

  const projects = projectsQuery.data?.data ?? []
  const tasks = tasksQuery.data?.data ?? []
  const overview = overviewQuery.data?.data
  const taskMetrics = taskMetricsQuery.data?.data

  const upcomingDeadlines = tasks
    .filter((task) => task.dueDate)
    .sort((a, b) => new Date(a.dueDate ?? 0).getTime() - new Date(b.dueDate ?? 0).getTime())
    .slice(0, 4)

  const activity = []

  return (
    <>
      <section>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-main">
              Welcome back, {user?.name ?? 'User'}
            </h2>
            <p className="mt-2 text-sm text-muted">
              Here&apos;s an overview of your projects and tasks.
            </p>
          </div>
          <Button variant="primary" onClick={() => navigate('/teams')}>Create project</Button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Active projects"
          value={overview ? String(overview.project.status.active) : '—'}
          caption="Based on your teams"
        />
        <MetricCard
          label="Tasks total"
          value={taskMetrics ? String(taskMetrics.total) : '—'}
          caption="Across your assignments"
        />
        <MetricCard
          label="Tasks in progress"
          value={taskMetrics ? String(taskMetrics.byStatus.in_progress) : '—'}
          caption="Currently active"
        />
        <MetricCard
          label="Overdue tasks"
          value={taskMetrics ? String(taskMetrics.overdue) : '—'}
          caption="Needs attention"
        />
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardCard
          title="My projects"
          description="Your most active initiatives."
          action={(
            <Button variant="outline" size="sm" onClick={() => navigate('/projects')}>
              View all
            </Button>
          )}
        >
          {projectsQuery.isLoading ? (
            <p className="text-sm text-muted">Loading projects...</p>
          ) : projectsQuery.isError ? (
            <EmptyState
              title="Unable to load projects"
              description="Try again in a moment."
              action={(
                <Button variant="outline" onClick={() => projectsQuery.refetch()}>
                  Retry
                </Button>
              )}
            />
          ) : projects.length ? (
            <div className="space-y-3">
              {projects.slice(0, 4).map((project) => (
                <ProjectItem
                  key={project.id}
                  name={project.name}
                  status={project.status}
                  archived={project.archived}
                  tags={project.tags}
                  due={project.deadline}
                  href={`/projects/${project.id}`}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No projects yet"
              description="Create a project from a team to start tracking work."
              action={(
                <Button variant="primary" onClick={() => navigate('/teams')}>
                  Browse teams
                </Button>
              )}
            />
          )}
        </DashboardCard>

        <DashboardCard
          title="Upcoming deadlines"
          description="Tasks that need attention soon."
        >
          {tasksQuery.isLoading ? (
            <p className="text-sm text-muted">Loading tasks...</p>
          ) : upcomingDeadlines.length ? (
            <div className="space-y-3">
              {upcomingDeadlines.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-md border border-border bg-base px-3 py-2 transition-colors hover:border-secondary"
                >
                  <div>
                    <p className="text-sm text-main">{item.title}</p>
                    <p className="mt-1 text-xs text-muted">Due {formatDate(item.dueDate)}</p>
                  </div>
                  <span className="h-4 w-4 rounded border border-border" />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No upcoming deadlines"
              description="You are all caught up for now."
            />
          )}
        </DashboardCard>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardCard title="Task overview" description="Live status counts across your tasks.">
          {taskMetricsQuery.isLoading ? (
            <p className="text-sm text-muted">Loading task metrics...</p>
          ) : taskMetrics ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-md border border-border bg-base px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted">To do</p>
                <p className="mt-2 text-2xl font-semibold text-main">{taskMetrics.byStatus.todo}</p>
              </div>
              <div className="rounded-md border border-border bg-base px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted">In progress</p>
                <p className="mt-2 text-2xl font-semibold text-main">{taskMetrics.byStatus.in_progress}</p>
              </div>
              <div className="rounded-md border border-border bg-base px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted">Blocked</p>
                <p className="mt-2 text-2xl font-semibold text-main">{taskMetrics.byStatus.blocked}</p>
              </div>
              <div className="rounded-md border border-border bg-base px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted">Done</p>
                <p className="mt-2 text-2xl font-semibold text-main">{taskMetrics.byStatus.done}</p>
              </div>
            </div>
          ) : (
            <EmptyState
              title="No task metrics yet"
              description="Create tasks to see status breakdowns."
              action={(
                <Button variant="primary" onClick={() => navigate('/projects')}>
                  Browse projects
                </Button>
              )}
            />
          )}
        </DashboardCard>

        <DashboardCard title="Team activity">
          {activity.length ? (
            <div className="space-y-4">
              {activity.map((item) => (
                <ActivityItem
                  key={`${item.name}-${item.time}`}
                  name={item.name}
                  action={item.action}
                  time={item.time}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No activity yet"
              description="Invite teammates to see updates here."
            />
          )}
        </DashboardCard>
      </section>
    </>
  )
}
