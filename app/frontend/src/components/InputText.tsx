import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export type InputSize = 'sm' | 'md' | 'lg'

type InputTextProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string
  error?: string
  size?: InputSize
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-3.5 text-sm',
  lg: 'h-11 px-4 text-base',
}

const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  ({ className, label, error, id, name, disabled, size = 'md', ...props }, ref) => {
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

        <input
          ref={ref}
          id={inputId}
          name={name}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(
            'w-full rounded-md border border-border bg-base text-main placeholder:text-muted',
            'transition-colors duration-150',
            'focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30',
            'disabled:cursor-not-allowed disabled:opacity-60',
            sizeClasses[size],
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

InputText.displayName = 'InputText'

export default InputText
