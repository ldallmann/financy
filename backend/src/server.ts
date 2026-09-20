import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import cors from 'cors'
import express from 'express'
import { buildContext, type Context } from './context.js'
import { env } from './lib/env.js'
import { prisma } from './lib/prisma.js'
import { resolvers } from './resolvers/index.js'
import { typeDefs } from './schema.js'

const EXPECTED_ERROR_CODES = new Set([
  'UNAUTHENTICATED',
  'NOT_FOUND',
  'BAD_USER_INPUT',
  'BAD_REQUEST',
  'GRAPHQL_PARSE_FAILED',
  'GRAPHQL_VALIDATION_FAILED',
])

async function main() {
  const app = express()

  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    formatError: (formatted, error) => {
      const code = String(formatted.extensions?.code ?? 'INTERNAL_SERVER_ERROR')
      const expected = EXPECTED_ERROR_CODES.has(code)
      if (!expected) console.error(error)
      return {
        message: expected ? formatted.message : 'Erro interno do servidor',
        path: formatted.path,
        extensions: { code, ...(expected && formatted.extensions?.fields ? { fields: formatted.extensions.fields } : {}) },
      }
    },
  })
  await server.start()

  app.use(
    cors({
      origin: env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',').map((o) => o.trim()) : true,
      credentials: true,
    }),
  )
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/graphql', expressMiddleware(server, { context: buildContext }))

  app.listen(env.PORT, () => {
    console.log(`🚀 Financy API rodando em http://localhost:${env.PORT}/graphql`)
  })
}

main().catch(async (error) => {
  console.error(error)
  await prisma.$disconnect()
  process.exit(1)
})
