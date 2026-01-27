type MetricCardProps = {
  label: string
  value: string
  caption?: string
  badge?: string
}

export default function MetricCard({ label, value, caption, badge }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5 transition-colors hover:border-secondary">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted">{label}</p>
        {badge ? (
          <span className="rounded-full border border-border bg-base px-2 py-0.5 text-xs text-secondary">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-3xl font-semibold text-main">{value}</p>
      {caption ? (
        <p className="mt-2 text-xs text-secondary">{caption}</p>
      ) : null}
    </div>
  )
}
