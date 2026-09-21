import { useMutation, useQuery } from '@apollo/client/react'
import { ArrowUpDown, Plus, Tag as TagIcon, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { CategoryCard } from '@/components/categories/category-card'
import { CategoryDialog } from '@/components/categories/category-dialog'
import { Button } from '@/components/ui/button'
import { Card, SectionTitle } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { DELETE_CATEGORY } from '@/graphql/mutations'
import { CATEGORIES, CATEGORIES_SUMMARY, DASHBOARD, TRANSACTIONS } from '@/graphql/queries'
import type { Category } from '@/graphql/types'
import { getErrorMessage } from '@/lib/apollo'
import { getCategoryColor, getCategoryIcon } from '@/lib/category-meta'
import { cn } from '@/lib/utils'
import { PageHeader } from './page-header'

function StatCard({ icon: Icon, iconClass, value, label }: { icon: LucideIcon; iconClass?: string; value: string; label: string }) {
  return (
    <Card className="flex items-start gap-4 p-6">
      <span className="flex size-8 shrink-0 items-center justify-center">
        <Icon size={24} className={cn('text-gray-600', iconClass)} />
      </span>
      <div className="flex min-w-0 flex-col gap-2">
        <p className="truncate text-3xl font-bold text-gray-800">{value}</p>
        <SectionTitle>{label}</SectionTitle>
      </div>
    </Card>
  )
}

export function CategoriesPage() {
  const { data, loading } = useQuery(CATEGORIES)
  const { data: summaryData } = useQuery(CATEGORIES_SUMMARY)

  const [dialog, setDialog] = useState<{ open: boolean; category: Category | null }>({ open: false, category: null })
  const [deleting, setDeleting] = useState<Category | null>(null)

  const [deleteCategory, deleteState] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [CATEGORIES, CATEGORIES_SUMMARY, DASHBOARD, TRANSACTIONS],
  })

  const categories = data?.categories ?? []
  const summary = summaryData?.categoriesSummary
  const mostUsed = summary?.mostUsedCategory ?? null

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await deleteCategory({ variables: { id: deleting.id } })
      toast.success('Categoria excluída')
      setDeleting(null)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível excluir a categoria'))
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Categorias"
        subtitle="Organize suas transações por categorias"
        action={
          <Button size="sm" icon={Plus} className="shrink-0" onClick={() => setDialog({ open: true, category: null })}>
            Nova categoria
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard icon={TagIcon} value={String(summary?.totalCategories ?? categories.length)} label="Total de categorias" />
        <StatCard icon={ArrowUpDown} iconClass="text-purple-base" value={String(summary?.totalTransactions ?? 0)} label="Total de transações" />
        <StatCard
          icon={mostUsed ? getCategoryIcon(mostUsed.icon) : TagIcon}
          iconClass={mostUsed ? getCategoryColor(mostUsed.color).text : undefined}
          value={mostUsed?.title ?? '—'}
          label="Categoria mais utilizada"
        />
      </div>

      {categories.length === 0 ? (
        <Card className="flex flex-col items-center gap-4 px-6 py-16 text-center">
          <p className="text-base font-medium text-gray-800">{loading ? 'Carregando categorias…' : 'Você ainda não tem categorias'}</p>
          {!loading && (
            <>
              <p className="max-w-sm text-sm text-gray-600">
                Crie categorias para organizar suas receitas e despesas e acompanhar para onde o seu dinheiro vai.
              </p>
              <Button size="sm" icon={Plus} onClick={() => setDialog({ open: true, category: null })}>
                Nova categoria
              </Button>
            </>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={(item) => setDialog({ open: true, category: item })}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      <CategoryDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((state) => ({ ...state, open }))}
        category={dialog.category}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Excluir categoria"
        description={
          deleting
            ? `Tem certeza que deseja excluir "${deleting.title}"? As transações vinculadas ficarão sem categoria.`
            : ''
        }
        loading={deleteState.loading}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
