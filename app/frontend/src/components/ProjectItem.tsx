import { Link } from 'react-router'
import { formatDate } from '@/utils/format-date'

type ProjectItemProps = {
  name: string
  status: 'active' | 'paused' | 'completed' | 'archived'
  tags?: string[]
  due?: string
  href?: string
}

const statusStyles = {
  active: 'text-success bg-success/10 border-success/20',
  paused: 'text-warning bg-warning/10 border-warning/20',
  completed: 'text-secondary bg-base border-border',
  archived: 'text-muted bg-surface border-border',
}

export default function ProjectItem({ name, status, tags, due, href }: ProjectItemProps) {
  const formattedDue = formatDate(due)
  const content = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-main">{name}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2 py-0.5 text-xs ${statusStyles[status]}`}
          >
            {status}
          </span>
          {tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      {formattedDue ? (
        <p className="text-xs text-muted">Due {formattedDue}</p>
      ) : null}
    </div>
  )

  if (href) {
    return (
      <Link
        to={href}
        className="block rounded-md border border-border bg-base px-4 py-3 transition-colors hover:border-secondary"
      >
        {content}
      </Link>
    )
  }

  return (
    <div className="rounded-md border border-border bg-base px-4 py-3 transition-colors hover:border-secondary">
      {content}
    </div>
  )
}
