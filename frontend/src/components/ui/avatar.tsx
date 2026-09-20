import { getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'

export interface AvatarProps {
  name: string
  size?: 'sm' | 'lg'
  className?: string
}

export function Avatar({ name, size = 'sm', className }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-gray-300 font-medium text-gray-800 select-none',
        size === 'sm' ? 'size-9 text-sm' : 'size-16 text-xl',
        className,
      )}
    >
      {getInitials(name)}
    </span>
  )
}
