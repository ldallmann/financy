import { z } from 'zod'

export const CATEGORY_COLORS = ['green', 'blue', 'purple', 'pink', 'red', 'orange', 'yellow'] as const

export const CATEGORY_ICONS = [
  'briefcase-business',
  'car-front',
  'heart-pulse',
  'piggy-bank',
  'shopping-cart',
  'ticket',
  'tool-case',
  'utensils',
  'paw-print',
  'house',
  'gift',
  'pill',
  'book-open',
  'hand-coins',
  'banknote',
  'receipt-text',
] as const

export const TRANSACTION_TYPES = ['INCOME', 'EXPENSE'] as const

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome completo').max(120, 'Nome muito longo'),
  email: z.string().trim().toLowerCase().email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres').max(72, 'Senha muito longa'),
})

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha'),
})

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome completo').max(120, 'Nome muito longo'),
})

export const categoryInputSchema = z.object({
  title: z.string().trim().min(1, 'Informe o título').max(60, 'Título muito longo'),
  description: z
    .string()
    .trim()
    .max(200, 'Descrição muito longa')
    .optional()
    .nullable()
    .transform((value) => (value ? value : null)),
  icon: z.enum(CATEGORY_ICONS, { message: 'Ícone inválido' }),
  color: z.enum(CATEGORY_COLORS, { message: 'Cor inválida' }),
})

export const transactionInputSchema = z.object({
  description: z.string().trim().min(1, 'Informe a descrição').max(120, 'Descrição muito longa'),
  type: z.enum(TRANSACTION_TYPES, { message: 'Tipo inválido' }),
  amount: z.number().int('Valor inválido').positive('O valor deve ser maior que zero'),
  date: z
    .string()
    .trim()
    .min(1, 'Informe a data')
    .transform((value, ctx) => {
      // "YYYY-MM-DD" vira meio-dia UTC para a data não mudar com o fuso horário
      const iso = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00.000Z` : value
      const parsed = new Date(iso)
      if (Number.isNaN(parsed.getTime())) {
        ctx.addIssue({ code: 'custom', message: 'Data inválida' })
        return z.NEVER
      }
      return parsed
    }),
  categoryId: z.string().trim().min(1).optional().nullable().transform((value) => value || null),
})

export const transactionFiltersSchema = z.object({
  search: z.string().trim().optional().nullable(),
  type: z.enum(TRANSACTION_TYPES).optional().nullable(),
  categoryId: z.string().trim().optional().nullable(),
  month: z.number().int().min(1).max(12).optional().nullable(),
  year: z.number().int().min(1970).max(2200).optional().nullable(),
  page: z.number().int().min(1).optional().nullable(),
  perPage: z.number().int().min(1).max(100).optional().nullable(),
})
