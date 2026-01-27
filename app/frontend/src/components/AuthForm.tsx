interface AuthFormProps {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function AuthForm({
  title,
  description,
  children,
  footer,
}: AuthFormProps) {
  return (
    <div className="w-full max-w-md bg-surface border border-border rounded-lg p-8 font-sans">
      <header className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-main">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-secondary">
            {description}
          </p>
        )}
      </header>

      <section className="space-y-4">
        {children}
      </section>

      {footer && (
        <footer className="mt-6 text-center text-sm text-muted">
          {footer}
        </footer>
      )}
    </div>
  )
}

