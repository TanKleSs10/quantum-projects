import { useMemo } from 'react'
import { Link } from 'react-router'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import EmptyState from '@/components/EmptyState'
import TaskItem from '@/components/TaskItem'
import type { Task, TaskStatus } from '@/features/tasks/tasks.types'

const STATUS_SECTIONS: Array<{
  key: TaskStatus
  label: string
  empty: string
}> = [
  { key: 'todo', label: 'To do', empty: 'No tasks queued.' },
  { key: 'in_progress', label: 'In progress', empty: 'Nothing being worked on.' },
  { key: 'blocked', label: 'Blocked', empty: 'No blockers right now.' },
  { key: 'done', label: 'Done', empty: 'No completed tasks yet.' },
]

type ProjectTaskBoardProps = {
  projectId: string
  tasks: Task[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

export default function ProjectTaskBoard({
  projectId,
  tasks,
  isLoading,
  isError,
  onRetry,
}: ProjectTaskBoardProps) {
  const tasksByStatus = useMemo(() => {
    return STATUS_SECTIONS.reduce<Record<TaskStatus, Task[]>>(
      (acc, section) => {
        acc[section.key] = tasks.filter((task) => task.status === section.key)
        return acc
      },
      {
        todo: [],
        in_progress: [],
        blocked: [],
        done: [],
      }
    )
  }, [tasks])

  if (isLoading) {
    return (
      <DashboardCard title="Task board">
        <p className="text-sm text-muted">Loading tasks...</p>
      </DashboardCard>
    )
  }

  if (isError) {
    return (
      <DashboardCard title="Task board">
        <EmptyState
          title="Unable to load tasks"
          description="Try again in a moment."
          action={(
            <Button variant="outline" onClick={onRetry}>
              Retry
            </Button>
          )}
        />
      </DashboardCard>
    )
  }

  if (!tasks.length) {
    return (
      <DashboardCard title="Task board">
        <EmptyState
          title="No tasks yet"
          description="Create tasks to keep the project moving."
          action={(
            <Link to={`/projects/${projectId}/task/create`}>
              <Button variant="primary">Create task</Button>
            </Link>
          )}
        />
      </DashboardCard>
    )
  }

  return (
    <DashboardCard title="Task board" description="Track work by status.">
      <div className="space-y-4">
        {STATUS_SECTIONS.map((section) => {
          const sectionTasks = tasksByStatus[section.key]
          return (
            <div key={section.key} className="rounded-md border border-border bg-base/50 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-main">{section.label}</p>
                <span className="text-xs text-muted">{sectionTasks.length}</span>
              </div>
              {sectionTasks.length ? (
                <div className="mt-3 space-y-2">
                  {sectionTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      title={task.title}
                      priority={task.priority}
                      done={task.status === 'done'}
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">{section.empty}</p>
              )}
            </div>
          )
        })}
      </div>
    </DashboardCard>
  )
}
