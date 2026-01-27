type TaskItemProps = {
  title: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  done?: boolean
}

const priorityStyles = {
  low: 'text-secondary bg-surface border-border',
  medium: 'text-warning bg-warning/10 border-warning/20',
  high: 'text-danger bg-danger/10 border-danger/20',
  urgent: 'text-danger bg-danger/10 border-danger/20',
}

export default function TaskItem({ title, priority, done }: TaskItemProps) {
  return (
    <div className="rounded-md border border-border bg-base px-3 py-2 transition-colors hover:border-secondary">
      <div className="flex items-center justify-between gap-2">
        <p className={`text-sm ${done ? 'text-muted line-through' : 'text-main'}`}>
          {title}
        </p>
        <span className={`rounded-full border px-2 py-0.5 text-xs ${priorityStyles[priority]}`}>
          {priority}
        </span>
      </div>
    </div>
  )
}
