import type { ReactNode } from 'react'

type DashboardCardProps = {
  title?: string
  description?: string
  action?: ReactNode
  children: ReactNode
}

export default function DashboardCard({
  title,
  description,
  action,
  children,
}: DashboardCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5 transition-colors hover:border-secondary">
      {title ? (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-main">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-muted">{description}</p>
            ) : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </div>
  )
}
