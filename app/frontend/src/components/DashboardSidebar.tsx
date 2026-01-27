import type { MouseEventHandler } from 'react'
import { NavLink, useNavigate } from 'react-router'
import useLogoutAction from '@/hooks/useLogout'

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Tasks', to: '/tasks' },
  { label: 'Teams', to: '/teams' },
  { label: 'Settings', to: '/settings' },
]

type DashboardSidebarProps = {
  className?: string
  onNavigate?: MouseEventHandler<HTMLAnchorElement>
}

export default function DashboardSidebar({ className, onNavigate }: DashboardSidebarProps) {
  const { logout } = useLogoutAction()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className={`w-64 flex-shrink-0 border-r border-border bg-surface ${className ?? ''}`}>
      <div className="flex h-full flex-col px-4 py-6">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                [
                  'flex items-center rounded-md px-3 py-2 text-sm',
                  isActive
                    ? 'bg-base text-main'
                    : 'text-muted hover:bg-base hover:text-main',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-8 border-t border-border pt-6">
          <nav className="space-y-1">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center rounded-md px-3 py-2 text-sm text-muted hover:bg-base hover:text-main"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>
    </aside>
  )
}
