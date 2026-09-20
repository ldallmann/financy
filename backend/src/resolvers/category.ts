import type { Category } from '@prisma/client'
import type { Context } from '../context.js'
import { requireAuth } from '../context.js'
import { badRequest, fromZod, notFound } from '../lib/errors.js'
import { categoryInputSchema } from '../lib/validation.js'

async function findOwnCategory(ctx: Context & { userId: string }, id: string): Promise<Category> {
  const category = await ctx.prisma.category.findFirst({ where: { id, userId: ctx.userId } })
  if (!category) throw notFound('Categoria não encontrada')
  return category
}

export const categoryResolvers = {
  Query: {
    categories: async (_: unknown, __: unknown, rawCtx: Context) => {
      const ctx = requireAuth(rawCtx)
      return ctx.prisma.category.findMany({
        where: { userId: ctx.userId },
        orderBy: { createdAt: 'asc' },
      })
    },

    categoriesSummary: async (_: unknown, __: unknown, rawCtx: Context) => {
      const ctx = requireAuth(rawCtx)
      const [totalCategories, totalTransactions, grouped] = await Promise.all([
        ctx.prisma.category.count({ where: { userId: ctx.userId } }),
        ctx.prisma.transaction.count({ where: { userId: ctx.userId } }),
        ctx.prisma.transaction.groupBy({
          by: ['categoryId'],
          where: { userId: ctx.userId, categoryId: { not: null } },
          _count: { _all: true },
          orderBy: { _count: { categoryId: 'desc' } },
          take: 1,
        }),
      ])

      const topId = grouped[0]?.categoryId ?? null
      const mostUsedCategory = topId
        ? await ctx.prisma.category.findFirst({ where: { id: topId, userId: ctx.userId } })
        : null

      return { totalCategories, totalTransactions, mostUsedCategory }
    },
  },

  Mutation: {
    createCategory: async (_: unknown, args: { input: unknown }, rawCtx: Context) => {
      const ctx = requireAuth(rawCtx)
      const parsed = categoryInputSchema.safeParse(args.input)
      if (!parsed.success) throw fromZod(parsed.error)

      return ctx.prisma.category.create({
        data: { ...parsed.data, userId: ctx.userId },
      })
    },

    updateCategory: async (_: unknown, args: { id: string; input: unknown }, rawCtx: Context) => {
      const ctx = requireAuth(rawCtx)
      const parsed = categoryInputSchema.safeParse(args.input)
      if (!parsed.success) throw fromZod(parsed.error)

      await findOwnCategory(ctx, args.id)
      return ctx.prisma.category.update({ where: { id: args.id }, data: parsed.data })
    },

    deleteCategory: async (_: unknown, args: { id: string }, rawCtx: Context) => {
      const ctx = requireAuth(rawCtx)
      if (!args.id) throw badRequest('Informe o id da categoria')

      await findOwnCategory(ctx, args.id)
      await ctx.prisma.category.delete({ where: { id: args.id } })
      return true
    },
  },

  Category: {
    createdAt: (category: Category) => category.createdAt.toISOString(),

    transactionsCount: (category: Category, _: unknown, ctx: Context) =>
      ctx.prisma.transaction.count({ where: { categoryId: category.id } }),

    transactionsTotal: async (category: Category, _: unknown, ctx: Context) => {
      const result = await ctx.prisma.transaction.aggregate({
        where: { categoryId: category.id },
        _sum: { amount: true },
      })
      return result._sum.amount ?? 0
    },
  },
}
