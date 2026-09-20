import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'
import { CombinedGraphQLErrors } from '@apollo/client/errors'
import { SetContextLink } from '@apollo/client/link/context'
import { ErrorLink } from '@apollo/client/link/error'
import { session } from './session'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string | undefined

if (!BACKEND_URL) {
  console.warn('VITE_BACKEND_URL não definida — copie .env.example para .env')
}

const httpLink = new HttpLink({ uri: BACKEND_URL ?? 'http://localhost:4000/graphql' })

const authLink = new SetContextLink((prevContext) => {
  const token = session.getToken()
  return {
    headers: {
      ...(prevContext.headers as Record<string, string> | undefined),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  }
})

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    const unauthenticated = error.errors.some((e) => e.extensions?.code === 'UNAUTHENTICATED')
    if (unauthenticated && session.getToken()) {
      session.clear()
      window.location.assign('/')
    }
  }
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network' },
  },
})

export function getErrorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.'): string {
  if (CombinedGraphQLErrors.is(error)) {
    return error.errors[0]?.message ?? fallback
  }
  if (error instanceof Error && error.message) {
    return /fetch|network/i.test(error.message) ? 'Não foi possível conectar à API.' : error.message
  }
  return fallback
}

export function getFieldErrors(error: unknown): Record<string, string> {
  if (CombinedGraphQLErrors.is(error)) {
    const fields = error.errors[0]?.extensions?.fields
    if (fields && typeof fields === 'object') return fields as Record<string, string>
  }
  return {}
}
