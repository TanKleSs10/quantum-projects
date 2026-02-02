import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import EmptyState from '@/components/EmptyState'
import {
  useArchiveProject,
  useCompleteProject,
  useDeleteProject,
  usePauseProject,
  useProjectById,
  useReopenProject,
} from '@/features/projects/projects.hooks'
import { toastClient } from '@/utils/toast'
import Modal from '../Modal'

type ProjectQuickActionsProps = {
  projectId: string
  canManage: boolean
}

export default function ProjectQuickActions({ projectId, canManage }: ProjectQuickActionsProps) {
  const navigate = useNavigate()
  const projectQuery = useProjectById(projectId)
  const pauseMutation = usePauseProject(projectId)
  const completeMutation = useCompleteProject(projectId)
  const archiveMutation = useArchiveProject(projectId)
  const reopenMutation = useReopenProject(projectId)
  const deleteMutation = useDeleteProject(projectId)
  const [isOpen, setIsOpen] = useState(false)

  const handleStatusChange = (action: 'pause' | 'complete' | 'archive' | 'reopen') => {
    const mutationMap = {
      pause: pauseMutation,
      complete: completeMutation,
      archive: archiveMutation,
      reopen: reopenMutation,
    }

    mutationMap[action].mutate(undefined, {
      onSuccess: () => {
        projectQuery.refetch()
        toastClient.success('Project updated successfully')
      },
      onError: (error) => {
        toastClient.error(error.message || 'Unable to update project')
      },
    })
  }

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toastClient.success('Project deleted successfully')
        navigate('/projects')
      },
      onError: (error) => {
        toastClient.error(error.message || 'Unable to delete project')
      },
    })
  }

  if (projectQuery.isLoading) {
    return (
      <DashboardCard title="Quick actions">
        <p className="text-sm text-muted">Loading actions...</p>
      </DashboardCard>
    )
  }

  if (projectQuery.isError || !projectQuery.data?.data) {
    return (
      <DashboardCard title="Quick actions">
        <EmptyState
          title="Unable to load project"
          description="Try again in a moment."
          action={(
            <Button variant="outline" onClick={() => projectQuery.refetch()}>
              Retry
            </Button>
          )}
        />
      </DashboardCard>
    )
  }

  const project = projectQuery.data.data

  return (
    <DashboardCard title="Quick actions">
      <div className="space-y-3">
        <Link to={`/projects/${projectId}/task/create`}>
          <Button className="w-full">Create task in this project</Button>
        </Link>
        {canManage ? (
          <Link to={`/projects/${projectId}/edit`}>
            <Button variant="ghost" className="w-full">Edit project</Button>
          </Link>
        ) : null}
        <div className="border-t border-border pt-3">
          {project.status === 'active' ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleStatusChange('pause')}
              disabled={pauseMutation.isPending || !canManage}
            >
              Pause project
            </Button>
          ) : null}
          {project.status === 'paused' ? (
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={() => handleStatusChange('pause')}
              disabled={pauseMutation.isPending || !canManage}
            >
              Resume project
            </Button>
          ) : null}
          {project.status !== 'completed' ? (
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={() => handleStatusChange('complete')}
              disabled={completeMutation.isPending || !canManage}
            >
              Mark as complete
            </Button>
          ) : null}
          {project.status === 'completed' ? (
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={() => handleStatusChange('reopen')}
              disabled={reopenMutation.isPending || !canManage}
            >
              Reopen project
            </Button>
          ) : null}
          {!project.archived ? (
            <Button
              variant="ghost"
              className="mt-2 w-full"
              onClick={() => handleStatusChange('archive')}
              disabled={archiveMutation.isPending || !canManage}
            >
              Archive project
            </Button>
          ) : null}
          {project.archived ? (
            <Button
              variant="ghost"
              className="mt-2 w-full"
              onClick={() => handleStatusChange('archive')}
              disabled={archiveMutation.isPending || !canManage}
            >
              Restore project
            </Button>
          ) : null}
        </div>
        {canManage ? (
          <Button variant='outline' className='outline outline-red-400 text-red-400 hover:bg-red-400/20 w-full' onClick={() => setIsOpen(true)}>Delete</Button>
        ) : null}
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}
          children={
            <div>
              <h2 className="text-lg font-semibold text-main">Confirm Deletion</h2>
              <p className="mt-2 text-sm text-muted">
                Are you sure you want to delete this project? This action cannot be undone.
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="outline" className='outline outline-red-400 text-red-400 hover:bg-red-400/20' onClick={handleDelete}>
                  Confirm Delete
                </Button>
              </div>
            </div>
          } />
      </div>
    </DashboardCard>
  )
}
