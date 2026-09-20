import { Check } from 'lucide-react'
import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, className, id, ...props },
  ref,
) {
  const fallbackId = useId()
  const inputId = id ?? fallbackId

  return (
    <label htmlFor={inputId} className={cn('inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700', className)}>
      <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
        <input ref={ref} id={inputId} type="checkbox" className="peer sr-only" {...props} />
        <span
          aria-hidden
          className={cn(
            'absolute inset-0 rounded border border-gray-300 bg-white transition-colors',
            'peer-checked:border-brand-base peer-checked:bg-brand-base peer-focus-visible:ring-2 peer-focus-visible:ring-brand-base/40',
          )}
        />
        <Check size={12} strokeWidth={3} className="relative text-white opacity-0 peer-checked:opacity-100" />
      </span>
      {label}
    </label>
  )
})
