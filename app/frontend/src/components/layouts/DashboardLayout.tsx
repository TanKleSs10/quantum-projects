import { useState } from 'react'
import type { ReactNode } from 'react'
import Button from '@/components/Button'
import DashboardSidebar from '@/components/DashboardSidebar'

type DashboardLayoutProps = {
  title: string
  userName: string
  userEmail: string
  children: ReactNode
}

export default function DashboardLayout({
  title,
  userName,
  userEmail,
  children,
}: DashboardLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-base text-main">
      <header className="border-b border-border bg-surface">
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
            {userName && userEmail ? (
              <div className="hidden text-right lg:block">
                <p className="text-sm font-medium text-main">{userName}</p>
                <p className="text-xs text-muted">{userEmail}</p>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto flex">
        <DashboardSidebar className="hidden lg:block" />
        <main className="flex-1 px-6 py-8">
          {children}
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
