import type { TaskStatus } from '@/features/tasks/tasks.types'

const statusStyles: Record<TaskStatus, string> = {
  todo: 'text-secondary bg-surface border-border',
  in_progress: 'text-warning bg-warning/10 border-warning/20',
  blocked: 'text-danger bg-danger/10 border-danger/20',
  done: 'text-success bg-success/10 border-success/20',
}

export default function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs ${statusStyles[status]}`}>
      {status.replace('_', ' ')}
    </span>
  )
}
