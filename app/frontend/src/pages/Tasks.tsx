import { Link } from 'react-router'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import EmptyState from '@/components/EmptyState'
import PageHeader from '@/components/PageHeader'
import TaskListItem from '@/components/tasks/TaskListItem'
import { useTasksByUser } from '@/features/tasks/tasks.hooks'
import { useAuthStore } from '@/store/auth.store'

export default function Tasks() {
  const tasksQuery = useTasksByUser()
  const tasks = tasksQuery.data?.data ?? []
  const user = useAuthStore((state) => state.user)

  return (
    <>
      <section>
        <PageHeader
          title="Tasks"
          description="Track and update tasks across your projects."
          action={(
            <Link to="/projects">
              <Button variant="primary">Create task</Button>
            </Link>
          )}
        />
      </section>

      <section className="mt-6">
        <DashboardCard title="All tasks">
          {tasksQuery.isLoading ? (
            <p className="text-sm text-muted">Loading tasks...</p>
          ) : tasks.length ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <Link className="block" key={task.id} to={`/tasks/${task.id}`}>
                  <TaskListItem
                    title={task.title}
                    status={task.status}
                    priority={task.priority}
                    assignee={user?.name ? `${user.name} (you)` : task.assigneeId}
                    dueDate={task.dueDate}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No tasks yet"
              description="Create tasks from a project to get started."
              action={(
                <Link to="/projects">
                  <Button variant="primary">Browse projects</Button>
                </Link>
              )}
            />
          )}
        </DashboardCard>
      </section>
    </>
  )
}
