import type { TaskPriority } from '@/features/tasks/tasks.types'

const priorityStyles: Record<TaskPriority, string> = {
  low: 'text-secondary bg-surface border-border',
  medium: 'text-warning bg-warning/10 border-warning/20',
  high: 'text-danger bg-danger/10 border-danger/20',
  urgent: 'text-danger bg-danger/10 border-danger/20',
}

export default function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs ${priorityStyles[priority]}`}>
      {priority}
    </span>
  )
}
