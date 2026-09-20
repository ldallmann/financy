import { SquarePen, Trash } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { CategoryIconBox } from '@/components/ui/category-icon'
import { IconButton } from '@/components/ui/icon-button'
import { Tag } from '@/components/ui/tag'
import type { Category } from '@/graphql/types'
import { formatItems } from '@/lib/format'

export interface CategoryCardProps {
  category: Category
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <Card className="flex flex-col gap-5 p-6">
      <div className="flex items-start justify-between">
        <CategoryIconBox icon={category.icon} color={category.color} />
        <div className="flex items-center gap-2">
          <IconButton icon={Trash} label="Excluir categoria" variant="danger" onClick={() => onDelete(category)} />
          <IconButton icon={SquarePen} label="Editar categoria" onClick={() => onEdit(category)} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="truncate text-base font-semibold text-gray-800">{category.title}</h3>
        <p className="line-clamp-2 h-10 text-sm text-gray-600">{category.description || 'Sem descrição'}</p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Tag color={category.color}>{category.title}</Tag>
        <span className="shrink-0 text-sm text-gray-600">{formatItems(category.transactionsCount)}</span>
      </div>
    </Card>
  )
}
