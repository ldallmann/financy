import { useMutation, useQuery } from '@apollo/client/react'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { TransactionDialog } from '@/components/transactions/transaction-dialog'
import { ALL, initialFilters, TransactionFilters, type FiltersState } from '@/components/transactions/transaction-filters'
import { TransactionsTable } from '@/components/transactions/transactions-table'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Pagination } from '@/components/ui/pagination'
import { DELETE_TRANSACTION } from '@/graphql/mutations'
import { CATEGORIES, CATEGORIES_SUMMARY, DASHBOARD, TRANSACTIONS } from '@/graphql/queries'
import type { Transaction, TransactionFilters as ApiFilters } from '@/graphql/types'
import { getErrorMessage } from '@/lib/apollo'
import { PageHeader } from './page-header'

const PER_PAGE = 10

function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

function toApiFilters(filters: FiltersState, page: number): ApiFilters {
  const [year, month] = filters.period === ALL ? [null, null] : filters.period.split('-').map(Number)
  return {
    search: filters.search.trim() || null,
    type: filters.type === ALL ? null : filters.type,
    categoryId: filters.categoryId === ALL ? null : filters.categoryId,
    month,
    year,
    page,
    perPage: PER_PAGE,
  }
}

export function TransactionsPage() {
  const [filters, setFilters] = useState<FiltersState>(initialFilters)
  const [page, setPage] = useState(1)
  const search = useDebounced(filters.search)

  const [dialog, setDialog] = useState<{ open: boolean; transaction: Transaction | null }>({ open: false, transaction: null })
  const [deleting, setDeleting] = useState<Transaction | null>(null)

  const apiFilters = toApiFilters({ ...filters, search }, page)
  const { data, previousData, loading } = useQuery(TRANSACTIONS, { variables: { filters: apiFilters } })
  const { data: categoriesData } = useQuery(CATEGORIES)

  const [deleteTransaction, deleteState] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: [TRANSACTIONS, DASHBOARD, CATEGORIES, CATEGORIES_SUMMARY],
  })

  const result = data?.transactions ?? previousData?.transactions
  const items = result?.items ?? []
  const total = result?.total ?? 0
  const totalPages = result?.totalPages ?? 1

  const handleFilters = (next: FiltersState) => {
    setFilters(next)
    setPage(1)
  }

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await deleteTransaction({ variables: { id: deleting.id } })
      toast.success('Transação excluída')
      setDeleting(null)
      if (items.length === 1 && page > 1) setPage(page - 1)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível excluir a transação'))
    }
  }

  const first = total === 0 ? 0 : (page - 1) * PER_PAGE + 1
  const last = Math.min(page * PER_PAGE, total)

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Transações"
        subtitle="Gerencie todas as suas transações financeiras"
        action={
          <Button size="sm" icon={Plus} onClick={() => setDialog({ open: true, transaction: null })}>
            Nova transação
          </Button>
        }
      />

      <TransactionFilters filters={filters} onChange={handleFilters} categories={categoriesData?.categories ?? []} />

      <Card className="overflow-hidden">
        <TransactionsTable
          transactions={items}
          loading={loading && !result}
          onEdit={(transaction) => setDialog({ open: true, transaction })}
          onDelete={setDeleting}
        />
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-6 py-5 sm:flex-row">
          <p className="text-sm text-gray-700">
            <span className="font-medium">{first}</span> a <span className="font-medium">{last}</span> | {total}{' '}
            {total === 1 ? 'resultado' : 'resultados'}
          </p>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </Card>

      <TransactionDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((state) => ({ ...state, open }))}
        transaction={dialog.transaction}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Excluir transação"
        description={deleting ? `Tem certeza que deseja excluir "${deleting.description}"? Essa ação não pode ser desfeita.` : ''}
        loading={deleteState.loading}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
