import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import { Link, useNavigate } from 'react-router'
import Modal from '../Modal'
import { useState } from 'react'
import { useDeleteTeam } from '@/features/team/team.hooks'
import { toastClient } from '@/utils/toast'

export default function TeamOverviewSettings({ teamId }: { teamId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const deleteTeamMutation = useDeleteTeam(teamId)
  const navigate = useNavigate()

  const handleDelete = () => {
    deleteTeamMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/teams')
        toastClient.success('Team deleted successfully')
      },
      onError: (error) => {
        toastClient.error(error.message || 'Failed to delete team')
      },
    })
  }

  return (
    <DashboardCard
      title="Settings"
      description="Manage your team name and description."
    >
      <div className="mt-4">
        <Link to={`/teams/${teamId}/settings`}>
          <Button variant="outline">
            Manage settings
          </Button>
        </Link>
        <Button variant="outline" className="ml-2 border-red-500 text-red-500 hover:bg-red-500/10" onClick={() => setIsOpen(true)}>
          Delete team
        </Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          children={
            <div>
              <h2 className="text-lg font-semibold">Delete Team</h2>
              <p className="mt-2 text-sm text-muted">
                Are you sure you want to delete this team? This action cannot be undone.
              </p>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button variant="outline" className="ml-2 border-red-500 text-red-500 hover:bg-red-500/10" onClick={handleDelete}>
                  Confirm Delete
                </Button>
              </div>
            </div>
          }
        />
      </div>
    </DashboardCard>
  )
}
