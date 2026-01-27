import { useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import EmptyState from '@/components/EmptyState'
import PageHeader from '@/components/PageHeader'
import TaskPriorityBadge from '@/components/tasks/TaskPriorityBadge'
import TaskStatusBadge from '@/components/tasks/TaskStatusBadge'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { useChangeTaskStatus, useTaskById } from '@/features/tasks/tasks.hooks'
import { useAuthStore } from '@/store/auth.store'
import { toastClient } from '@/utils/toast'

export default function TaskOverview() {
  const user = useAuthStore((state) => state.user)
  const { taskId } = useParams()
  const queryClient = useQueryClient()
  const taskQuery = useTaskById(taskId)
  const task = taskQuery.data?.data
  const changeStatusMutation = useChangeTaskStatus(taskId || '')

  const handleMarkDone = () => {
    if (!taskId) {
      return
    }

    changeStatusMutation.mutate(
      { status: 'done' },
      {
        onSuccess: () => {
          toastClient.success('Task marked as done')
          queryClient.invalidateQueries({ queryKey: ['task', taskId] })
          queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
        onError: (error) => {
          toastClient.error(error.message || 'Failed to update task status')
        },
      }
    )
  }

  return (
    <DashboardLayout
      title="Task"
      userName={user?.name ?? ''}
      userEmail={user?.email ?? ''}
    >
      <section>
        <PageHeader
          title={task?.title ?? 'Task'}
          description="Task details and status updates."
          action={(
            <Link to="/tasks">
              <Button variant="outline">Back to tasks</Button>
            </Link>
          )}
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardCard title="Task details">
          {taskQuery.isLoading ? (
            <p className="text-sm text-muted">Loading task...</p>
          ) : task ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <TaskStatusBadge status={task.status} />
                <TaskPriorityBadge priority={task.priority} />
              </div>
              {task.description ? (
                <p className="text-sm text-muted">{task.description}</p>
              ) : (
                <p className="text-sm text-muted">No description provided yet.</p>
              )}
              <div className="rounded-md border border-border bg-base px-4 py-3 text-sm">
                <p className="text-secondary">Assignee</p>
                <p className="mt-1 text-main">{task.assigneeId ?? 'Unassigned'}</p>
              </div>
              <div className="rounded-md border border-border bg-base px-4 py-3 text-sm">
                <p className="text-secondary">Due date</p>
                <p className="mt-1 text-main">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                </p>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Task not found"
              description="We couldn’t load the task details."
            />
          )}
        </DashboardCard>

        <DashboardCard title="Quick actions">
          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={handleMarkDone}
              disabled={!task || task.status === 'done' || changeStatusMutation.isPending}
            >
              {task?.status === 'done' ? 'Completed' : 'Mark as done'}
            </Button>
            <Button variant="outline" className="w-full" disabled>
              Reassign
            </Button>
            <Button variant="ghost" className="w-full" disabled>
              Edit task
            </Button>
          </div>
        </DashboardCard>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardCard title="Notes">
          <EmptyState
            title="No notes yet"
            description="Capture updates or blockers for this task."
            action={<Button variant="outline">Add note</Button>}
          />
        </DashboardCard>

        <DashboardCard title="Related links">
          <EmptyState
            title="No links yet"
            description="Attach docs and resources when ready."
          />
        </DashboardCard>
      </section>
    </DashboardLayout>
  )
}
