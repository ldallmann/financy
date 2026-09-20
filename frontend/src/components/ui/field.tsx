import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface FieldProps {
  label?: string
  htmlFor?: string
  helper?: string
  error?: string
  className?: string
  children: ReactNode
}

export function Field({ label, htmlFor, helper, error, className, children }: FieldProps) {
  return (
    <div className={cn('group flex w-full flex-col gap-2', className)} data-error={error ? '' : undefined}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-gray-700 group-focus-within:text-brand-base group-data-error:text-danger"
        >
          {label}
        </label>
      )}
      {children}
      {(error || helper) && (
        <p className={cn('text-xs', error ? 'text-danger' : 'text-gray-500')} role={error ? 'alert' : undefined}>
          {error ?? helper}
        </p>
      )}
    </div>
  )
}

export const controlClassName = cn(
  'flex min-h-[50px] w-full items-center gap-3 rounded-lg border border-gray-300 bg-white px-[13px] py-[15px] text-base text-gray-800 transition-colors',
  'focus-within:border-brand-base group-data-error:border-danger',
  'has-disabled:bg-gray-100 has-disabled:text-gray-400',
)
