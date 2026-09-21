import { useMutation, useQuery } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, type SelectOption } from '@/components/ui/select'
import { TYPE_META } from '@/components/ui/type-badge'
import { CREATE_TRANSACTION, UPDATE_TRANSACTION } from '@/graphql/mutations'
import { CATEGORIES, CATEGORIES_SUMMARY, DASHBOARD, TRANSACTIONS } from '@/graphql/queries'
import type { Transaction, TransactionType } from '@/graphql/types'
import { getErrorMessage } from '@/lib/apollo'
import { getCategoryColor, getCategoryIcon } from '@/lib/category-meta'
import { centsToInput, formatCurrency, inputToCents, isoToDateInput, MAX_AMOUNT_CENTS, todayDateInput } from '@/lib/format'
import { cn } from '@/lib/utils'

const schema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  description: z.string().trim().min(1, 'Informe a descrição').max(120, 'Descrição muito longa'),
  date: z.string().min(1, 'Informe a data'),
  amount: z
    .number()
    .int('Valor inválido')
    .positive('Informe um valor maior que zero')
    .max(MAX_AMOUNT_CENTS, `Valor máximo permitido: ${formatCurrency(MAX_AMOUNT_CENTS)}`),
  categoryId: z.string(),
})

type FormData = z.infer<typeof schema>

const defaults = (): FormData => ({ type: 'EXPENSE', description: '', date: todayDateInput(), amount: 0, categoryId: '' })

export interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction | null
}

export function TransactionDialog({ open, onOpenChange, transaction }: TransactionDialogProps) {
  const editing = Boolean(transaction)
  const { data: categoriesData } = useQuery(CATEGORIES, { skip: !open })
  const categories = categoriesData?.categories ?? []

  const refetchQueries = [TRANSACTIONS, DASHBOARD, CATEGORIES, CATEGORIES_SUMMARY]
  const [createTransaction, createState] = useMutation(CREATE_TRANSACTION, { refetchQueries })
  const [updateTransaction, updateState] = useMutation(UPDATE_TRANSACTION, { refetchQueries })
  const loading = createState.loading || updateState.loading

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: defaults() })

  useEffect(() => {
    if (!open) return
    reset(
      transaction
        ? {
            type: transaction.type,
            description: transaction.description,
            date: isoToDateInput(transaction.date),
            amount: transaction.amount,
            categoryId: transaction.categoryId ?? '',
          }
        : defaults(),
    )
  }, [open, transaction, reset])

  const onSubmit = handleSubmit(async (values) => {
    const input = { ...values, categoryId: values.categoryId || null }
    try {
      if (transaction) {
        await updateTransaction({ variables: { id: transaction.id, input } })
        toast.success('Transação atualizada')
      } else {
        await createTransaction({ variables: { input } })
        toast.success('Transação criada')
      }
      onOpenChange(false)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível salvar a transação'))
    }
  })

  const categoryOptions: SelectOption[] = categories.map((category) => {
    const Icon = getCategoryIcon(category.icon)
    return {
      value: category.id,
      textValue: category.title,
      label: (
        <span className="flex items-center gap-2">
          <Icon size={16} className={getCategoryColor(category.color).text} />
          {category.title}
        </span>
      ),
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={editing ? 'Editar transação' : 'Nova transação'} description="Registre sua despesa ou receita">
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <Controller control={control} name="type" render={({ field }) => <TypeToggle value={field.value} onChange={field.onChange} />} />

            <Input
              label="Descrição"
              placeholder="Ex. Almoço no restaurante"
              error={errors.description?.message}
              {...register('description')}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input label="Data" type="date" error={errors.date?.message} {...register('date')} />
              <Controller
                control={control}
                name="amount"
                render={({ field }) => (
                  <Input
                    label="Valor"
                    inputMode="numeric"
                    placeholder="0,00"
                    prefix="R$"
                    value={field.value ? centsToInput(field.value) : ''}
                    onChange={(event) => field.onChange(inputToCents(event.target.value))}
                    onBlur={field.onBlur}
                    error={errors.amount?.message}
                  />
                )}
              />
            </div>

            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select
                  label="Categoria"
                  placeholder={categories.length ? 'Selecione' : 'Nenhuma categoria cadastrada'}
                  options={categoryOptions}
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  disabled={categories.length === 0}
                  error={errors.categoryId?.message}
                />
              )}
            />
          </div>

          <Button type="submit" fullWidth loading={loading}>
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function TypeToggle({ value, onChange }: { value: TransactionType; onChange: (type: TransactionType) => void }) {
  const options: TransactionType[] = ['EXPENSE', 'INCOME']
  const labels: Record<TransactionType, string> = { EXPENSE: 'Despesa', INCOME: 'Receita' }

  return (
    <div role="radiogroup" aria-label="Tipo da transação" className="grid grid-cols-2 gap-2 rounded-lg border border-gray-300 p-1">
      {options.map((type) => {
        const meta = TYPE_META[type]
        const Icon = meta.icon
        const selected = value === type
        return (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(type)}
            className={cn(
              'flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors',
              'focus-visible:ring-2 focus-visible:ring-brand-base/40 focus-visible:outline-none',
              selected
                ? type === 'EXPENSE'
                  ? 'border-danger bg-red-light/40 text-red-dark'
                  : 'border-brand-base bg-green-light/40 text-green-dark'
                : 'border-transparent text-gray-600 hover:bg-gray-100',
            )}
          >
            <Icon size={16} className={selected ? undefined : 'text-gray-400'} />
            {labels[type]}
          </button>
        )
      })}
    </div>
  )
}
