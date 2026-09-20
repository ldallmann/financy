import { SquarePen, Trash } from 'lucide-react'
import { CategoryIconBox } from '@/components/ui/category-icon'
import { IconButton } from '@/components/ui/icon-button'
import { Tag } from '@/components/ui/tag'
import { TypeBadge } from '@/components/ui/type-badge'
import type { Transaction } from '@/graphql/types'
import { formatShortDate, formatSignedCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

export interface TransactionsTableProps {
  transactions: Transaction[]
  loading?: boolean
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

const headerClass = 'label-caps px-6 py-5 font-medium'

export function TransactionsTable({ transactions, loading = false, onEdit, onDelete }: TransactionsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th scope="col" className={cn(headerClass, 'text-left')}>
              Descrição
            </th>
            <th scope="col" className={cn(headerClass, 'w-28 text-center')}>
              Data
            </th>
            <th scope="col" className={cn(headerClass, 'w-50 text-center')}>
              Categoria
            </th>
            <th scope="col" className={cn(headerClass, 'w-34 text-center')}>
              Tipo
            </th>
            <th scope="col" className={cn(headerClass, 'w-50 text-right')}>
              Valor
            </th>
            <th scope="col" className={cn(headerClass, 'w-30 text-right')}>
              Ações
            </th>
          </tr>
        </thead>
        <tbody className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                {loading ? 'Carregando transações…' : 'Nenhuma transação encontrada.'}
              </td>
            </tr>
          ) : (
            transactions.map((transaction) => (
              <tr key={transaction.id} className="h-18 border-b border-gray-200 last:border-b-0">
                <td className="px-6">
                  <div className="flex items-center gap-4">
                    <CategoryIconBox icon={transaction.category?.icon} color={transaction.category?.color} />
                    <span className="truncate text-base font-medium text-gray-800">{transaction.description}</span>
                  </div>
                </td>
                <td className="px-6 text-center text-sm whitespace-nowrap text-gray-600">{formatShortDate(transaction.date)}</td>
                <td className="px-6 text-center">
                  <Tag color={transaction.category?.color}>{transaction.category?.title ?? 'Sem categoria'}</Tag>
                </td>
                <td className="px-6 text-center">
                  <TypeBadge type={transaction.type} />
                </td>
                <td className="px-6 text-right text-sm font-semibold whitespace-nowrap text-gray-800">
                  {formatSignedCurrency(transaction.amount, transaction.type)}
                </td>
                <td className="px-6">
                  <div className="flex items-center justify-end gap-2">
                    <IconButton icon={Trash} label="Excluir transação" variant="danger" onClick={() => onDelete(transaction)} />
                    <IconButton icon={SquarePen} label="Editar transação" onClick={() => onEdit(transaction)} />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
