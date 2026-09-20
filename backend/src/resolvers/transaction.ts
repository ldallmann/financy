import type { Prisma, Transaction } from '@prisma/client'
import type { Context } from '../context.js'
import { requireAuth } from '../context.js'
import { currentMonth, monthRange } from '../lib/dates.js'
import { badRequest, fromZod, notFound } from '../lib/errors.js'
import { transactionFiltersSchema, transactionInputSchema } from '../lib/validation.js'

type AuthCtx = Context & { userId: string }

async function findOwnTransaction(ctx: AuthCtx, id: string): Promise<Transaction> {
  const transaction = await ctx.prisma.transaction.findFirst({ where: { id, userId: ctx.userId } })
  if (!transaction) throw notFound('Transação não encontrada')
  return transaction
}

async function assertOwnCategory(ctx: AuthCtx, categoryId: string | null): Promise<void> {
  if (!categoryId) return
  const category = await ctx.prisma.category.findFirst({ where: { id: categoryId, userId: ctx.userId } })
  if (!category) throw badRequest('Categoria inválida', { categoryId: 'Categoria não encontrada' })
}

async function sumByType(ctx: AuthCtx, type: 'INCOME' | 'EXPENSE', date?: { gte: Date; lt: Date }) {
  const result = await ctx.prisma.transaction.aggregate({
    where: { userId: ctx.userId, type, ...(date ? { date } : {}) },
    _sum: { amount: true },
  })
  return result._sum.amount ?? 0
}

export const transactionResolvers = {
  Query: {
    transactions: async (_: unknown, args: { filters?: unknown }, rawCtx: Context) => {
      const ctx = requireAuth(rawCtx)
      const parsed = transactionFiltersSchema.safeParse(args.filters ?? {})
      if (!parsed.success) throw fromZod(parsed.error)
      const filters = parsed.data

      const page = filters.page ?? 1
      const perPage = filters.perPage ?? 10

      const where: Prisma.TransactionWhereInput = { userId: ctx.userId }
      if (filters.search) where.description = { contains: filters.search }
      if (filters.type) where.type = filters.type
      if (filters.categoryId) where.categoryId = filters.categoryId
      if (filters.month && filters.year) where.date = monthRange(filters.year, filters.month)
      else if (filters.year) where.date = { gte: new Date(Date.UTC(filters.year, 0, 1)), lt: new Date(Date.UTC(filters.year + 1, 0, 1)) }

      const [total, items] = await Promise.all([
        ctx.prisma.transaction.count({ where }),
        ctx.prisma.transaction.findMany({
          where,
          orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
          skip: (page - 1) * perPage,
          take: perPage,
        }),
      ])

      return { items, total, page, perPage, totalPages: Math.max(1, Math.ceil(total / perPage)) }
    },

    recentTransactions: async (_: unknown, args: { limit?: number | null }, rawCtx: Context) => {
      const ctx = requireAuth(rawCtx)
      const limit = Math.min(Math.max(args.limit ?? 5, 1), 50)
      return ctx.prisma.transaction.findMany({
        where: { userId: ctx.userId },
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        take: limit,
      })
    },

    dashboardSummary: async (_: unknown, args: { month?: number | null; year?: number | null }, rawCtx: Context) => {
      const ctx = requireAuth(rawCtx)
      const fallback = currentMonth()
      const month = args.month ?? fallback.month
      const year = args.year ?? fallback.year
      if (month < 1 || month > 12) throw badRequest('Mês inválido')

      const range = monthRange(year, month)
      const [income, expenses, monthlyIncome, monthlyExpenses] = await Promise.all([
        sumByType(ctx, 'INCOME'),
        sumByType(ctx, 'EXPENSE'),
        sumByType(ctx, 'INCOME', range),
        sumByType(ctx, 'EXPENSE', range),
      ])

      return { balance: income - expenses, monthlyIncome, monthlyExpenses, month, year }
    },
  },

  Mutation: {
    createTransaction: async (_: unknown, args: { input: unknown }, rawCtx: Context) => {
      const ctx = requireAuth(rawCtx)
      const parsed = transactionInputSchema.safeParse(args.input)
      if (!parsed.success) throw fromZod(parsed.error)

      await assertOwnCategory(ctx, parsed.data.categoryId)
      return ctx.prisma.transaction.create({ data: { ...parsed.data, userId: ctx.userId } })
    },

    updateTransaction: async (_: unknown, args: { id: string; input: unknown }, rawCtx: Context) => {
      const ctx = requireAuth(rawCtx)
      const parsed = transactionInputSchema.safeParse(args.input)
      if (!parsed.success) throw fromZod(parsed.error)

      await findOwnTransaction(ctx, args.id)
      await assertOwnCategory(ctx, parsed.data.categoryId)
      return ctx.prisma.transaction.update({ where: { id: args.id }, data: parsed.data })
    },

    deleteTransaction: async (_: unknown, args: { id: string }, rawCtx: Context) => {
      const ctx = requireAuth(rawCtx)
      if (!args.id) throw badRequest('Informe o id da transação')

      await findOwnTransaction(ctx, args.id)
      await ctx.prisma.transaction.delete({ where: { id: args.id } })
      return true
    },
  },

  Transaction: {
    date: (transaction: Transaction) => transaction.date.toISOString(),
    createdAt: (transaction: Transaction) => transaction.createdAt.toISOString(),
    category: (transaction: Transaction, _: unknown, ctx: Context) =>
      transaction.categoryId
        ? ctx.prisma.category.findUnique({ where: { id: transaction.categoryId } })
        : null,
  },
}
