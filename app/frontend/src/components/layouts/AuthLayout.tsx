import { Outlet } from 'react-router'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="w-full py-6 flex justify-center">
        <h1 className="text-2xl font-semibold text-brand">
          Quantum <span className="text-main">Projects</span>
        </h1>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md bg-surface border border-border rounded-lg p-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 flex justify-center">
        <p className="text-sm text-muted">
          Developed by Quantum MD
        </p>
      </footer>
    </div>
  )
}
