import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import EmptyState from '@/components/EmptyState'
import TaskItem from '@/components/TaskItem'
import { useTeamTasks } from '@/features/team/team.hooks'

export default function TeamOverviewTasks({ teamId }: { teamId: string }) {
  const { data, isLoading, isError, refetch } = useTeamTasks(teamId);
  const tasks = data?.data ?? [];
  return (
    <DashboardCard
      title="Tasks"
      description="Recent tasks across team projects."
    >
      {isLoading ? (
        <p className="text-sm text-muted">Loading tasks...</p>
      ) : isError ? (
        <EmptyState
          title="Unable to load tasks"
          description="Try again in a moment."
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      ) : tasks.length ? (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              title={task.title}
              priority={task.priority}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No tasks to show"
          description="Tasks will appear here once projects are created."
        />
      )}
    </DashboardCard>
  )
}
