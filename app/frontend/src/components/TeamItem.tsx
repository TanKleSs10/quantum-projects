import { Link } from 'react-router'

type TeamItemProps = {
  name: string
  description?: string
  membersCount: number
  projectsCount?: number
  href?: string
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('')

export default function TeamItem({
  name,
  description,
  membersCount,
  projectsCount,
  href,
}: TeamItemProps) {
  const content = (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-xs font-semibold text-main">
            {getInitials(name)}
          </div>
          <div>
            <p className="text-sm font-semibold text-main">{name}</p>
            {description ? (
              <p className="mt-1 text-xs text-muted">{description}</p>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="rounded-full border border-border bg-surface px-2 py-0.5">
            {membersCount} members
          </span>
          {projectsCount !== undefined ? (
            <span className="rounded-full border border-border bg-surface px-2 py-0.5">
              {projectsCount} projects
            </span>
          ) : null}
        </div>
      </div>
    </>
  )

  if (href) {
    return (
      <Link
        to={href}
        className="block rounded-md border border-border bg-base p-4 transition-colors hover:border-secondary"
      >
        {content}
      </Link>
    )
  }

  return (
    <div className="rounded-md border border-border bg-base p-4 transition-colors hover:border-secondary">
      {content}
    </div>
  )
}
