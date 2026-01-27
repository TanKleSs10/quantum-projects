import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-6 text-main">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted">
          The page you are looking for does not exist.
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
