import { useNavigate } from 'react-router'
import Button from '@/components/Button'
import DashboardCard from '@/components/DashboardCard'
import EmptyState from '@/components/EmptyState'
import PageHeader from '@/components/PageHeader'
import ProjectItem from '@/components/ProjectItem'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { useGetProjectsByUser } from '@/features/projects/projects.hooks'
import { useAuthStore } from '@/store/auth.store'

export default function Projects() {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useGetProjectsByUser()
  const projects = data?.data ?? []

  return (
    <DashboardLayout
      title="Projects"
      userName={user?.name ?? 'User'}
      userEmail={user?.email ?? 'user@email.com'}
    >
      <section>
        <PageHeader
          title="Projects"
          description="All projects you collaborate on."
          action={
            <Button variant="primary" onClick={() => navigate('/projects/create')}>
              + Create project
            </Button>
          }
        />
      </section>

      <section className="mt-6">
        <DashboardCard
          title="Your projects"
          description="Projects across all your teams."
        >
          {isLoading ? (
            <p className="text-sm text-muted">Loading projects...</p>
          ) : isError ? (
            <EmptyState
              title="Unable to load projects"
              description="Try again in a moment."
              action={
                <Button variant="outline" onClick={() => refetch()}>
                  Retry
                </Button>
              }
            />
          ) : projects.length ? (
            <div className="space-y-3">
              {projects.map((project) => (
                <ProjectItem
                  key={project.id}
                  name={project.name}
                  status={project.status}
                  tags={project.tags}
                  due={project.deadline}
                  href={`/projects/${project.id}`}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No projects yet"
              description="Create a project to start tracking work."
              action={
                <Button variant="primary" onClick={() => navigate('/projects/create')}>
                  Create project
                </Button>
              }
            />
          )}
        </DashboardCard>
      </section>
    </DashboardLayout>
  )
}
