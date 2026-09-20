import type { LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon
  label: string
  variant?: 'default' | 'danger'
  active?: boolean
}

export function IconButton({
  icon: Icon,
  label,
  variant = 'default',
  active = false,
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-colors',
        'focus-visible:ring-2 focus-visible:ring-brand-base/40 focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-50',
        active
          ? 'border-brand-base bg-brand-base text-white'
          : variant === 'danger'
            ? 'border-gray-300 bg-white text-danger hover:bg-red-light'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100',
        className,
      )}
      {...props}
    >
      <Icon size={16} />
    </button>
  )
}
