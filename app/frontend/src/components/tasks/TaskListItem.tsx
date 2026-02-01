import TaskPriorityBadge from '@/components/tasks/TaskPriorityBadge'
import TaskStatusBadge from '@/components/tasks/TaskStatusBadge'
import type { TaskPriority, TaskStatus } from '@/features/tasks/tasks.types'
import { formatDate } from '@/utils/format-date'

type TaskListItemProps = {
  title: string
  status: TaskStatus
  priority: TaskPriority
  assignee?: string
  dueDate?: string
}

export default function TaskListItem({
  title,
  status,
  priority,
  assignee,
  dueDate,
}: TaskListItemProps) {
  const formattedDue = formatDate(dueDate)
  return (
    <div className="rounded-md border border-border bg-base px-4 py-3 transition-colors hover:border-secondary">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-main">{title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <TaskStatusBadge status={status} />
            <TaskPriorityBadge priority={priority} />
          </div>
        </div>
        <div className="text-right text-xs text-muted">
          {assignee ? <p>{assignee}</p> : <p>Unassigned</p>}
          {formattedDue ? <p className="mt-1">Due {formattedDue}</p> : null}
        </div>
      </div>
    </div>
  )
}
