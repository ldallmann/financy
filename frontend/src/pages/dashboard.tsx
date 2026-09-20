import { useQuery } from '@apollo/client/react'
import { CircleArrowDown, CircleArrowUp, Plus, Wallet, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { TransactionDialog } from '@/components/transactions/transaction-dialog'
import { Card, SectionTitle } from '@/components/ui/card'
import { CategoryIconBox } from '@/components/ui/category-icon'
import { Tag } from '@/components/ui/tag'
import { TextButton, TextLink } from '@/components/ui/text-link'
import { TypeIcon } from '@/components/ui/type-badge'
import { DASHBOARD } from '@/graphql/queries'
import { formatCurrency, formatItems, formatShortDate, formatSignedCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

function SummaryCard({ icon: Icon, iconClass, label, value }: { icon: LucideIcon; iconClass: string; label: string; value: string }) {
  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-3">
        <Icon size={20} className={iconClass} />
        <SectionTitle>{label}</SectionTitle>
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </Card>
  )
}

export function DashboardPage() {
  const { data, loading } = useQuery(DASHBOARD, { variables: { limit: 5 } })
  const [dialogOpen, setDialogOpen] = useState(false)

  const summary = data?.dashboardSummary
  const recent = data?.recentTransactions ?? []
  const categories = [...(data?.categories ?? [])]
    .filter((category) => category.transactionsCount > 0)
    .sort((a, b) => b.transactionsTotal - a.transactionsTotal)
    .slice(0, 5)

  const money = (cents?: number) => (cents === undefined ? (loading ? '—' : formatCurrency(0)) : formatCurrency(cents))

  return (
    <div className="flex flex-col gap-6">
      <h1 className="sr-only">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SummaryCard icon={Wallet} iconClass="text-purple-base" label="Saldo total" value={money(summary?.balance)} />
        <SummaryCard icon={CircleArrowUp} iconClass="text-green-dark" label="Receitas do mês" value={money(summary?.monthlyIncome)} />
        <SummaryCard icon={CircleArrowDown} iconClass="text-red-dark" label="Despesas do mês" value={money(summary?.monthlyExpenses)} />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-200 py-5 pr-3 pl-6">
            <SectionTitle>Transações recentes</SectionTitle>
            <TextLink to="/transacoes" chevron>
              Ver todas
            </TextLink>
          </div>

          <ul>
            {recent.length === 0 && (
              <li className="px-6 py-10 text-center text-sm text-gray-500">
                {loading ? 'Carregando…' : 'Nenhuma transação ainda. Que tal registrar a primeira?'}
              </li>
            )}
            {recent.map((transaction) => (
              <li key={transaction.id} className="flex h-20 items-center border-b border-gray-200">
                <div className="flex min-w-0 flex-1 items-center gap-4 px-6">
                  <CategoryIconBox icon={transaction.category?.icon} color={transaction.category?.color} />
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-base font-medium text-gray-800">{transaction.description}</span>
                    <span className="text-sm text-gray-600">{formatShortDate(transaction.date)}</span>
                  </div>
                </div>
                <div className="hidden w-40 justify-center px-6 sm:flex">
                  <Tag color={transaction.category?.color}>{transaction.category?.title ?? 'Sem categoria'}</Tag>
                </div>
                <div className="flex min-w-40 items-center justify-end gap-2 px-6">
                  <span className="text-sm font-semibold whitespace-nowrap text-gray-800">
                    {formatSignedCurrency(transaction.amount, transaction.type)}
                  </span>
                  <TypeIcon type={transaction.type} />
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-center px-6 py-5">
            <TextButton icon={Plus} onClick={() => setDialogOpen(true)}>
              Nova transação
            </TextButton>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
            <SectionTitle>Categorias</SectionTitle>
            <TextLink to="/categorias" chevron>
              Gerenciar
            </TextLink>
          </div>
          <ul className={cn('flex flex-col gap-5 p-6', categories.length === 0 && 'items-center')}>
            {categories.length === 0 && (
              <li className="py-4 text-center text-sm text-gray-500">
                {loading ? 'Carregando…' : 'Nenhuma categoria com transações.'}
              </li>
            )}
            {categories.map((category) => (
              <li key={category.id} className="flex items-center gap-1">
                <Tag color={category.color}>{category.title}</Tag>
                <span className="flex-1 text-right text-sm text-gray-600">{formatItems(category.transactionsCount)}</span>
                <span className="w-22 text-right text-sm font-semibold whitespace-nowrap text-gray-800">
                  {formatCurrency(category.transactionsTotal)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <TransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
