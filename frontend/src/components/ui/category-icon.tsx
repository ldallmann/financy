import { createElement } from 'react'
import { getCategoryColor, getCategoryIcon } from '@/lib/category-meta'
import { cn } from '@/lib/utils'

export interface CategoryIconBoxProps {
  icon: string | null | undefined
  color: string | null | undefined
  className?: string
}

export function CategoryIconBox({ icon, color, className }: CategoryIconBoxProps) {
  const palette = getCategoryColor(color)
  return (
    <span className={cn('inline-flex size-10 shrink-0 items-center justify-center rounded-lg', palette.bg, palette.text, className)}>
      {createElement(getCategoryIcon(icon), { size: 16 })}
    </span>
  )
}
