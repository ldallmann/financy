import { Loader2, type LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'outline' | 'danger'
type Size = 'md' | 'sm'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: LucideIcon
  loading?: boolean
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand-base text-white hover:bg-brand-dark',
  outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100',
  danger: 'bg-danger text-white hover:bg-red-dark',
}

const sizes: Record<Size, { button: string; icon: number }> = {
  md: { button: 'h-12 gap-2 px-4 text-base', icon: 18 },
  sm: { button: 'h-9 gap-2 px-3 text-sm', icon: 16 },
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  const iconSize = sizes[size].icon
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center rounded-lg font-medium transition-colors',
        'focus-visible:ring-2 focus-visible:ring-brand-base/40 focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size].button,
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 size={iconSize} className="animate-spin" /> : Icon ? <Icon size={iconSize} /> : null}
      {children}
    </button>
  )
}
