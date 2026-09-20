import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '@/graphql/mutations'
import { CATEGORIES, CATEGORIES_SUMMARY, DASHBOARD } from '@/graphql/queries'
import type { Category } from '@/graphql/types'
import { getErrorMessage } from '@/lib/apollo'
import {
  CATEGORY_COLOR_NAMES,
  CATEGORY_COLORS,
  CATEGORY_ICON_NAMES,
  CATEGORY_ICONS,
  type CategoryColor,
  type CategoryIcon,
} from '@/lib/category-meta'
import { cn } from '@/lib/utils'

const schema = z.object({
  title: z.string().trim().min(1, 'Informe o título').max(60, 'Título muito longo'),
  description: z.string().trim().max(200, 'Descrição muito longa'),
  icon: z.enum(CATEGORY_ICON_NAMES as [CategoryIcon, ...CategoryIcon[]]),
  color: z.enum(CATEGORY_COLOR_NAMES as [CategoryColor, ...CategoryColor[]]),
})

type FormData = z.infer<typeof schema>

const defaults: FormData = { title: '', description: '', icon: 'briefcase-business', color: 'green' }

export interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
}

export function CategoryDialog({ open, onOpenChange, category }: CategoryDialogProps) {
  const editing = Boolean(category)
  const refetchQueries = [CATEGORIES, CATEGORIES_SUMMARY, DASHBOARD]
  const [createCategory, createState] = useMutation(CREATE_CATEGORY, { refetchQueries })
  const [updateCategory, updateState] = useMutation(UPDATE_CATEGORY, { refetchQueries })
  const loading = createState.loading || updateState.loading

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: defaults })

  useEffect(() => {
    if (!open) return
    reset(
      category
        ? {
            title: category.title,
            description: category.description ?? '',
            icon: (category.icon as CategoryIcon) ?? defaults.icon,
            color: (category.color as CategoryColor) ?? defaults.color,
          }
        : defaults,
    )
  }, [open, category, reset])

  const onSubmit = handleSubmit(async (values) => {
    const input = { ...values, description: values.description || null }
    try {
      if (category) {
        await updateCategory({ variables: { id: category.id, input } })
        toast.success('Categoria atualizada')
      } else {
        await createCategory({ variables: { input } })
        toast.success('Categoria criada')
      }
      onOpenChange(false)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível salvar a categoria'))
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={editing ? 'Editar categoria' : 'Nova categoria'}
        description="Organize suas transações com categorias"
      >
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <Input label="Título" placeholder="Ex. Alimentação" error={errors.title?.message} {...register('title')} />
            <Input
              label="Descrição"
              placeholder="Descrição da categoria"
              helper="Opcional"
              error={errors.description?.message}
              {...register('description')}
            />

            <Controller
              control={control}
              name="icon"
              render={({ field }) => (
                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-2 text-sm font-medium text-gray-700">Ícone</legend>
                  <div className="grid grid-cols-8 gap-2">
                    {CATEGORY_ICON_NAMES.map((name) => {
                      const Icon = CATEGORY_ICONS[name]
                      const selected = field.value === name
                      return (
                        <button
                          key={name}
                          type="button"
                          aria-label={name}
                          aria-pressed={selected}
                          onClick={() => field.onChange(name)}
                          className={cn(
                            'flex aspect-square cursor-pointer items-center justify-center rounded-lg border bg-white transition-colors',
                            'focus-visible:ring-2 focus-visible:ring-brand-base/40 focus-visible:outline-none',
                            selected
                              ? 'border-brand-base text-brand-base ring-1 ring-brand-base'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-100',
                          )}
                        >
                          <Icon size={16} />
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              )}
            />

            <Controller
              control={control}
              name="color"
              render={({ field }) => (
                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-2 text-sm font-medium text-gray-700">Cor</legend>
                  <div className="grid grid-cols-7 gap-2">
                    {CATEGORY_COLOR_NAMES.map((name) => {
                      const palette = CATEGORY_COLORS[name]
                      const selected = field.value === name
                      return (
                        <button
                          key={name}
                          type="button"
                          aria-label={palette.label}
                          aria-pressed={selected}
                          onClick={() => field.onChange(name)}
                          className={cn(
                            'flex h-8 cursor-pointer items-center justify-center rounded-lg border-2 border-transparent p-[3px] transition-all',
                            'focus-visible:ring-2 focus-visible:ring-brand-base/40 focus-visible:outline-none',
                            selected && 'border-brand-base',
                          )}
                        >
                          <span className={cn('flex size-full items-center justify-center rounded-[4px] text-white', palette.swatch)}>
                            {selected && <Check size={14} strokeWidth={3} />}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
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
