import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import EmptyState from '@/components/EmptyState'
import PageHeader from '@/components/PageHeader'
import Modal from '@/components/Modal'
import TaskPriorityBadge from '@/components/tasks/TaskPriorityBadge'
import TaskStatusBadge from '@/components/tasks/TaskStatusBadge'
import { useChangeTaskStatus, useTaskById, useAssignTask } from '@/features/tasks/tasks.hooks'
import { useProjectById } from '@/features/projects/projects.hooks'
import { useTeamById } from '@/features/team/team.hooks'
import { useAuthStore } from '@/store/auth.store'
import { toastClient } from '@/utils/toast'
import { useLayoutStore } from '@/store/layout.store'
import { formatDate } from '@/utils/format-date'

export default function TaskOverview() {
  const { taskId } = useParams()
  const queryClient = useQueryClient()
  const taskQuery = useTaskById(taskId)
  const task = taskQuery.data?.data
  const changeStatusMutation = useChangeTaskStatus(taskId || '')
  const assignTaskMutation = useAssignTask(taskId || '')
  const projectQuery = useProjectById(task?.projectId)
  const teamQuery = useTeamById(projectQuery.data?.data?.teamId)
  const setPageTitle = useLayoutStore((state) => state.setPageTitle)
  const user = useAuthStore((state) => state.user)
  const [isReassignOpen, setIsReassignOpen] = useState(false)
  const [assigneeId, setAssigneeId] = useState('')
  const members = useMemo(() => teamQuery.data?.data.members ?? [], [teamQuery.data])
  const hasMembers = members.length > 1

  useEffect(() => {
    setPageTitle(task?.title ?? 'Task')
    return () => setPageTitle(null)
  }, [setPageTitle, task?.title])

  const role = useMemo(() => {
    return members.find((member) => member.userId === user?.id)?.role
  }, [members, user?.id])

  const canManage = role === 'owner' || role === 'admin'

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

  const handleReassign = () => {
    if (!taskId) {
      return
    }
    if (!assigneeId) {
      toastClient.error('Select a member to assign')
      return
    }

    assignTaskMutation.mutate(
      { assigneeId },
      {
        onSuccess: () => {
          toastClient.success('Task reassigned')
          queryClient.invalidateQueries({ queryKey: ['task', taskId] })
          queryClient.invalidateQueries({ queryKey: ['tasks'] })
          setIsReassignOpen(false)
        },
        onError: (error) => {
          toastClient.error(error.message || 'Failed to reassign task')
        },
      }
    )
  }

  const openReassignModal = () => {
    setAssigneeId(task?.assigneeId ?? '')
    setIsReassignOpen(true)
  }

  return (
    <>
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
                <p className="mt-1 text-main">
                  {task.assigneeId
                    ? (() => {
                      const assignee = members.find((member) => member.userId === task.assigneeId)
                      const assigneeName = assignee?.user?.name
                      if (assigneeName && assignee?.userId === user?.id) {
                        return `${assigneeName} (you)`
                      }
                      return assigneeName ?? task.assigneeId
                    })()
                    : 'Unassigned'}
                </p>
              </div>
              <div className="rounded-md border border-border bg-base px-4 py-3 text-sm">
                <p className="text-secondary">Due date</p>
                <p className="mt-1 text-main">
                  {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
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
            <Button
              variant="outline"
              className="w-full"
              onClick={openReassignModal}
              disabled={!task || !canManage || !hasMembers}
            >
              Reassign
            </Button>
            <Button variant="ghost" className="w-full" disabled>
              Edit task
            </Button>
          </div>
        </DashboardCard>
      </section>

      <Modal isOpen={isReassignOpen} onClose={() => setIsReassignOpen(false)}>
        <div>
          <h2 className="text-lg font-semibold text-main">Reassign task</h2>
          <p className="mt-2 text-sm text-muted">
            Select a team member to assign this task.
          </p>
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-secondary" htmlFor="assignee">
              Team member
            </label>
            <select
              id="assignee"
              className="w-full rounded-md border border-border bg-base px-3 py-2 text-sm text-main transition-colors duration-150 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
              value={assigneeId}
              onChange={(event) => setAssigneeId(event.target.value)}
            >
              <option value="">Select assignee</option>
              {members.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.user?.name ?? member.userId}
                </option>
              ))}
            </select>
            {!hasMembers ? (
              <p className="mt-2 text-sm text-danger">No team members available.</p>
            ) : null}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsReassignOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleReassign}
              disabled={assignTaskMutation.isPending || !assigneeId}
            >
              {assignTaskMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </Modal>

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
    </>
  )
}
