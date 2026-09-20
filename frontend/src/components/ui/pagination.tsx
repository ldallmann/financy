import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconButton } from './icon-button'

export interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function visiblePages(page: number, totalPages: number): number[] {
  const start = Math.max(1, Math.min(page - 1, totalPages - 2))
  const end = Math.min(totalPages, start + 2)
  const pages: number[] = []
  for (let p = start; p <= end; p++) pages.push(p)
  return pages
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <nav aria-label="Paginação" className="flex items-center gap-2">
      <IconButton icon={ChevronLeft} label="Página anterior" disabled={page <= 1} onClick={() => onPageChange(page - 1)} />
      {visiblePages(page, totalPages).map((p) => (
        <button
          key={p}
          type="button"
          aria-current={p === page ? 'page' : undefined}
          onClick={() => onPageChange(p)}
          className={cn(
            'inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium transition-colors',
            'focus-visible:ring-2 focus-visible:ring-brand-base/40 focus-visible:outline-none',
            p === page
              ? 'border-brand-base bg-brand-base text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100',
          )}
        >
          {p}
        </button>
      ))}
      <IconButton
        icon={ChevronRight}
        label="Próxima página"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      />
    </nav>
  )
}
