import { getCategoryColor } from '@/lib/category-meta'
import { cn } from '@/lib/utils'

export interface TagProps {
  color: string | null | undefined
  children: React.ReactNode
  className?: string
}

export function Tag({ color, children, className }: TagProps) {
  const palette = getCategoryColor(color)
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center truncate rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap',
        palette.bg,
        palette.text,
        className,
      )}
    >
      {children}
    </span>
  )
}
