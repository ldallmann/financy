import { Search } from 'lucide-react'
import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, type SelectOption } from '@/components/ui/select'
import type { Category, TransactionType } from '@/graphql/types'
import { formatMonthYear } from '@/lib/format'

export const ALL = 'all'

export interface FiltersState {
  search: string
  type: TransactionType | typeof ALL
  categoryId: string
  period: string
}

export const initialFilters: FiltersState = { search: '', type: ALL, categoryId: ALL, period: ALL }

export interface TransactionFiltersProps {
  filters: FiltersState
  onChange: (filters: FiltersState) => void
  categories: Category[]
}

function periodOptions(): SelectOption[] {
  const now = new Date()
  const options: SelectOption[] = [{ value: ALL, label: 'Todos os períodos' }]
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    options.push({ value: `${year}-${String(month).padStart(2, '0')}`, label: formatMonthYear(month, year) })
  }
  return options
}

export function TransactionFilters({ filters, onChange, categories }: TransactionFiltersProps) {
  const periods = useMemo(() => periodOptions(), [])
  const categoryOptions: SelectOption[] = [
    { value: ALL, label: 'Todas' },
    ...categories.map((category) => ({ value: category.id, label: category.title })),
  ]

  return (
    <Card className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
      <Input
        label="Buscar"
        type="search"
        icon={Search}
        placeholder="Buscar por descrição"
        value={filters.search}
        onChange={(event) => onChange({ ...filters, search: event.target.value })}
      />
      <Select
        label="Tipo"
        options={[
          { value: ALL, label: 'Todos' },
          { value: 'INCOME', label: 'Entrada' },
          { value: 'EXPENSE', label: 'Saída' },
        ]}
        value={filters.type}
        onValueChange={(value) => onChange({ ...filters, type: value as FiltersState['type'] })}
      />
      <Select
        label="Categoria"
        options={categoryOptions}
        value={filters.categoryId}
        onValueChange={(value) => onChange({ ...filters, categoryId: value })}
      />
      <Select
        label="Período"
        options={periods}
        value={filters.period}
        onValueChange={(value) => onChange({ ...filters, period: value })}
      />
    </Card>
  )
}
