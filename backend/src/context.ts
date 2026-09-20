import type { PrismaClient } from '@prisma/client'
import type { Request } from 'express'
import { verifyToken } from './lib/auth.js'
import { unauthenticated } from './lib/errors.js'
import { prisma } from './lib/prisma.js'

export interface Context {
  prisma: PrismaClient
  userId: string | null
}

export type AuthenticatedContext = Context & { userId: string }

export async function buildContext({ req }: { req: Request }): Promise<Context> {
  const header = req.headers.authorization ?? ''
  const [scheme, token] = header.split(' ')
  const userId = scheme === 'Bearer' && token ? verifyToken(token) : null

  return { prisma, userId }
}

export function requireAuth(ctx: Context): AuthenticatedContext {
  if (!ctx.userId) throw unauthenticated()
  return ctx as AuthenticatedContext
}
