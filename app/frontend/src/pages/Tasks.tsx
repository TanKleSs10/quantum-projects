import { Link } from 'react-router'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import EmptyState from '@/components/EmptyState'
import PageHeader from '@/components/PageHeader'
import TaskListItem from '@/components/tasks/TaskListItem'
import { useTasksByUser } from '@/features/tasks/tasks.hooks'

export default function Tasks() {
  const tasksQuery = useTasksByUser()
  const tasks = tasksQuery.data?.data ?? []

  return (
    <>
      <section>
        <PageHeader
          title="Tasks"
          description="Track and update tasks across your projects."
          action={(
            <Link to="/tasks/create">
              <Button variant="primary">+ New task</Button>
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
                    assignee={task.assigneeId}
                    dueDate={task.dueDate}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No tasks yet"
              description="Create your first task to get started."
              action={(
                <Link to="/tasks/create">
                  <Button variant="primary">Create task</Button>
                </Link>
              )}
            />
          )}
        </DashboardCard>
      </section>
    </>
  )
}
