type DashboardStatCardProps = {
  label: string
  value: string
  caption: string
}

export default function DashboardStatCard({
  label,
  value,
  caption,
}: DashboardStatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-main">{value}</p>
      <p className="mt-2 text-xs text-secondary">{caption}</p>
    </div>
  )
}
