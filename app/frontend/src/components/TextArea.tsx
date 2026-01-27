import { forwardRef, useId } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, id, name, disabled, rows = 4, ...props }, ref) => {
    const fallbackId = useId()
    const inputId = id ?? name ?? fallbackId
    const errorId = error ? `${inputId}-error` : undefined

    return (
      <div className="w-full">
        {label ? (
          <label
            className="mb-1.5 block text-sm font-medium text-secondary"
            htmlFor={inputId}
          >
            {label}
          </label>
        ) : null}

        <textarea
          ref={ref}
          id={inputId}
          name={name}
          rows={rows}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(
            'w-full rounded-md border border-border bg-base px-3 py-2 text-sm text-main placeholder:text-muted',
            'transition-colors duration-150',
            'focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30',
            'disabled:cursor-not-allowed disabled:opacity-60',
            error && 'border-danger focus-visible:ring-danger/40',
            className
          )}
          {...props}
        />

        {error ? (
          <p id={errorId} className="mt-2 text-sm text-danger">
            {error}
          </p>
        ) : null}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'

export default TextArea
