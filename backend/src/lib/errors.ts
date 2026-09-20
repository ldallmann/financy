import { GraphQLError } from 'graphql'
import { ZodError } from 'zod'

export function unauthenticated(message = 'Não autenticado'): GraphQLError {
  return new GraphQLError(message, {
    extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
  })
}

export function notFound(message = 'Registro não encontrado'): GraphQLError {
  return new GraphQLError(message, { extensions: { code: 'NOT_FOUND' } })
}

export function badRequest(message: string, fields?: Record<string, string>): GraphQLError {
  return new GraphQLError(message, {
    extensions: { code: 'BAD_USER_INPUT', ...(fields ? { fields } : {}) },
  })
}

export function fromZod(error: ZodError): GraphQLError {
  const fields: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_'
    if (!fields[key]) fields[key] = issue.message
  }
  const first = Object.values(fields)[0] ?? 'Dados inválidos'
  return badRequest(first, fields)
}
