import { Link } from 'react-router'

export default function Forbidden() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-6 text-main">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-muted">
          You do not have permission to view this page.
        </p>
        <div className="mt-6">
          <Link className="text-accent hover:text-accent-hover" to="/">
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
