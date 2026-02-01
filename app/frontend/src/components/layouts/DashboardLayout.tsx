import { useState } from 'react'
import Button from '@/components/Button'
import DashboardSidebar from '@/components/DashboardSidebar'
import { Outlet, useLocation } from 'react-router'
import { useAuthStore } from '@/store/auth.store'
import { useLayoutStore } from '@/store/layout.store'

export default function DashboardLayout() {
  const user = useAuthStore((state) => state.user)
  const pageTitle = useLayoutStore((state) => state.pageTitle)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // get a title from path
  const path = useLocation().pathname
  const fallbackTitle = path
    .split('/')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' - ') || 'Dashboard'
  const title = pageTitle ?? fallbackTitle

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-base text-main">
      <header className="shrink-0 border-b border-border bg-surface">
        <div className="flex items-center justify-between gap-6 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <Button variant="outline" size="sm" onClick={() => setIsMenuOpen(true)}>
                Menu
              </Button>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Quantum Projects</p>
              <h1 className="mt-1 text-2xl font-semibold">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden text-right lg:block">
                <p className="text-sm font-medium text-main">{user.name}</p>
                <p className="text-xs text-muted">{user.email}</p>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="w-full flex flex-1 overflow-hidden">
        <div className="hidden h-full lg:block">
          <DashboardSidebar />
        </div>
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <Outlet />
        </main>
      </div>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden">
          <div className="absolute left-0 top-0 h-full w-72 bg-surface">
            <div className="flex items-center justify-between px-4 py-4">
              <p className="text-sm font-semibold text-main">Menu</p>
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(false)}>
                Close
              </Button>
            </div>
            <DashboardSidebar
              className="w-full border-r-0"
              onNavigate={() => setIsMenuOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
