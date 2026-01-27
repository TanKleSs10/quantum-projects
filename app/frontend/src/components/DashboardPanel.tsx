import type { ReactNode } from 'react'

type DashboardPanelProps = {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}

export default function DashboardPanel({
  title,
  description,
  action,
  children,
}: DashboardPanelProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-main">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-muted">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  )
}
