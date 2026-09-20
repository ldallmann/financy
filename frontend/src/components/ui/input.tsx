import type { LucideIcon } from 'lucide-react'
import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { controlClassName, Field } from './field'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string
  helper?: string
  error?: string
  icon?: LucideIcon
  prefix?: ReactNode
  suffix?: ReactNode
  containerClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helper, error, icon: Icon, prefix, suffix, className, containerClassName, id, ...props },
  ref,
) {
  const fallbackId = useId()
  const inputId = id ?? fallbackId

  return (
    <Field label={label} htmlFor={inputId} helper={helper} error={error} className={containerClassName}>
      <div className={cn(controlClassName, 'leading-[18px]')}>
        {Icon && <Icon size={16} className="shrink-0 text-gray-500 group-data-error:text-danger" />}
        {prefix && <span className="shrink-0 text-gray-500">{prefix}</span>}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          className={cn('min-w-0 flex-1 bg-transparent leading-[18px] outline-none disabled:cursor-not-allowed', className)}
          {...props}
        />
        {suffix && <span className="flex shrink-0 items-center text-gray-500">{suffix}</span>}
      </div>
    </Field>
  )
})
