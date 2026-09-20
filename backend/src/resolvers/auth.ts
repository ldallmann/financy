import type { Context } from '../context.js'
import { requireAuth } from '../context.js'
import { hashPassword, signToken, verifyPassword } from '../lib/auth.js'
import { badRequest, fromZod } from '../lib/errors.js'
import { loginSchema, registerSchema, updateProfileSchema } from '../lib/validation.js'

export const authResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, ctx: Context) => {
      if (!ctx.userId) return null
      return ctx.prisma.user.findUnique({ where: { id: ctx.userId } })
    },
  },

  Mutation: {
    register: async (_: unknown, args: unknown, ctx: Context) => {
      const parsed = registerSchema.safeParse(args)
      if (!parsed.success) throw fromZod(parsed.error)
      const { name, email, password } = parsed.data

      const exists = await ctx.prisma.user.findUnique({ where: { email } })
      if (exists) throw badRequest('Já existe uma conta com este e-mail', { email: 'E-mail já cadastrado' })

      const user = await ctx.prisma.user.create({
        data: { name, email, password: await hashPassword(password) },
      })

      return { token: signToken(user.id), user }
    },

    login: async (_: unknown, args: unknown, ctx: Context) => {
      const parsed = loginSchema.safeParse(args)
      if (!parsed.success) throw fromZod(parsed.error)
      const { email, password } = parsed.data

      const user = await ctx.prisma.user.findUnique({ where: { email } })
      const valid = user ? await verifyPassword(password, user.password) : false
      if (!user || !valid) throw badRequest('E-mail ou senha inválidos')

      return { token: signToken(user.id), user }
    },

    updateProfile: async (_: unknown, args: unknown, rawCtx: Context) => {
      const ctx = requireAuth(rawCtx)
      const parsed = updateProfileSchema.safeParse(args)
      if (!parsed.success) throw fromZod(parsed.error)

      return ctx.prisma.user.update({
        where: { id: ctx.userId },
        data: { name: parsed.data.name },
      })
    },
  },

  User: {
    createdAt: (user: { createdAt: Date }) => user.createdAt.toISOString(),
  },
}
