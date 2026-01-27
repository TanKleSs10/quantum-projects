import ActivityItem from '@/components/ActivityItem'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import EmptyState from '@/components/EmptyState'
import MetricCard from '@/components/MetricCard'
import ProjectItem from '@/components/ProjectItem'
import TaskItem from '@/components/TaskItem'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { useAuthStore } from '@/store/auth.store'

export default function Dashboard() {
  const user = useAuthStore((state) => state.user)
  const projects = [
    {
      name: 'Client Onboarding',
      status: 'active' as const,
      tags: ['Q1', 'Priority'],
      due: 'Apr 18',
    },
    {
      name: 'Market Expansion',
      status: 'paused' as const,
      tags: ['Research'],
      due: 'May 2',
    },
    {
      name: 'Mobile Experience',
      status: 'completed' as const,
      tags: ['Release'],
    },
  ]
  const deadlines: Array<{ title: string; due: string }> = []
  const taskBoard = {
    todo: [
      { title: 'Draft kickoff agenda', priority: 'low' as const },
      { title: 'Outline sprint goals', priority: 'medium' as const },
    ],
    inProgress: [
      { title: 'Sync with design team', priority: 'high' as const },
      { title: 'QA core workflows', priority: 'medium' as const },
    ],
    completed: [
      { title: 'Update roadmap notes', priority: 'low' as const },
      { title: 'Share weekly recap', priority: 'low' as const },
    ],
  }
  const activity = [
    { name: 'Andrea', action: 'joined the Growth team.', time: '2h ago' },
    { name: 'Miguel', action: 'completed Design review.', time: '4h ago' },
    { name: 'Sofia', action: 'commented on Launch plan.', time: '6h ago' },
  ]

  return (
    <DashboardLayout
      title="Dashboard"
      userName={user?.name ?? 'User'}
      userEmail={user?.email ?? 'user@email.com'}
    >
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
          <Button variant="primary">+ New project</Button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Active projects"
          value="12"
          caption="+2 this week"
        />
        <MetricCard
          label="Tasks in progress"
          value="48"
          caption="74% on track"
        />
        <MetricCard
          label="Pending reviews"
          value="7"
          caption="3 need attention"
        />
        <MetricCard
          label="Completed tasks"
          value="128"
          caption="+18 this month"
        />
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardCard
          title="My Projects"
          description="Your most active initiatives this week."
          action={<Button variant="outline" size="sm">View all</Button>}
        >
          {projects.length ? (
            <div className="space-y-3">
              {projects.map((project) => (
                <ProjectItem
                  key={project.name}
                  name={project.name}
                  status={project.status}
                  tags={project.tags}
                  due={project.due}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No projects yet"
              description="Create your first project to start tracking work."
              action={<Button variant="primary">Create project</Button>}
            />
          )}
        </DashboardCard>

        <DashboardCard
          title="Upcoming deadlines"
          description="Tasks that need attention soon."
        >
          {deadlines.length ? (
            <div className="space-y-3">
              {deadlines.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between rounded-md border border-border bg-base px-3 py-2 transition-colors hover:border-secondary"
                >
                  <div>
                    <p className="text-sm text-main">{item.title}</p>
                    <p className="mt-1 text-xs text-muted">Due {item.due}</p>
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
        <DashboardCard title="Task overview" description="Lightweight board for focus.">
          {taskBoard.todo.length || taskBoard.inProgress.length || taskBoard.completed.length ? (
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="mb-3 text-xs uppercase tracking-wide text-muted">To do</p>
                <div className="space-y-2">
                  {taskBoard.todo.length ? (
                    taskBoard.todo.map((task) => (
                      <TaskItem key={task.title} title={task.title} priority={task.priority} />
                    ))
                  ) : (
                    <EmptyState
                      title="No tasks"
                      description="Add tasks to keep work moving."
                    />
                  )}
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs uppercase tracking-wide text-muted">In progress</p>
                <div className="space-y-2">
                  {taskBoard.inProgress.length ? (
                    taskBoard.inProgress.map((task) => (
                      <TaskItem key={task.title} title={task.title} priority={task.priority} />
                    ))
                  ) : (
                    <EmptyState
                      title="No tasks"
                      description="Everything is currently clear."
                    />
                  )}
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs uppercase tracking-wide text-muted">Completed</p>
                <div className="space-y-2">
                  {taskBoard.completed.length ? (
                    taskBoard.completed.map((task) => (
                      <TaskItem
                        key={task.title}
                        title={task.title}
                        priority={task.priority}
                        done
                      />
                    ))
                  ) : (
                    <EmptyState
                      title="No completions yet"
                      description="Finish a task to see progress."
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              title="No tasks yet"
              description="Create your first task to get started."
              action={<Button variant="primary">Create task</Button>}
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
    </DashboardLayout>
  )
}
