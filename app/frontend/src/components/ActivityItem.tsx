type ActivityItemProps = {
  name: string
  action: string
  time: string
}

export default function ActivityItem({ name, action, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-full border border-border bg-base" />
      <div>
        <p className="text-sm text-main">
          <span className="font-medium">{name}</span> {action}
        </p>
        <p className="mt-1 text-xs text-muted">{time}</p>
      </div>
    </div>
  )
}
