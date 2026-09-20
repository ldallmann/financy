import { CircleArrowDown, CircleArrowUp } from 'lucide-react'
import type { TransactionType } from '@/graphql/types'
import { cn } from '@/lib/utils'

export const TYPE_META: Record<TransactionType, { label: string; icon: typeof CircleArrowUp; text: string }> = {
  INCOME: { label: 'Entrada', icon: CircleArrowUp, text: 'text-green-dark' },
  EXPENSE: { label: 'Saída', icon: CircleArrowDown, text: 'text-red-dark' },
}

export function TypeBadge({ type, className }: { type: TransactionType; className?: string }) {
  const meta = TYPE_META[type]
  const Icon = meta.icon
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm font-medium', meta.text, className)}>
      <Icon size={16} />
      {meta.label}
    </span>
  )
}

export function TypeIcon({ type, size = 16, className }: { type: TransactionType; size?: number; className?: string }) {
  const meta = TYPE_META[type]
  const Icon = meta.icon
  return <Icon size={size} className={cn('shrink-0', meta.text, className)} />
}
