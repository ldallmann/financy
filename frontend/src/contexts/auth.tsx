import { useApolloClient, useQuery } from '@apollo/client/react'
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { ME } from '@/graphql/queries'
import type { User } from '@/graphql/types'
import { session } from '@/lib/session'

interface AuthContextValue {
  user: User | null
  loading: boolean
  signIn: (token: string, user: User, remember: boolean) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient()
  const [token, setToken] = useState<string | null>(() => session.getToken())

  const { data, loading } = useQuery(ME, {
    skip: !token,
    fetchPolicy: 'cache-first',
  })

  // Token inválido/expirado: encerra a sessão durante a renderização (estado derivado)
  if (token && !loading && data && data.me === null) {
    session.clear()
    setToken(null)
  }

  const signIn = useCallback(
    async (nextToken: string, user: User, remember: boolean) => {
      session.setToken(nextToken, remember)
      // resetStore mantém a query "me" inscrita; clearStore descartaria os watches e o login não refletiria
      await client.resetStore().catch(() => undefined)
      client.writeQuery({ query: ME, data: { me: user } })
      setToken(nextToken)
    },
    [client],
  )

  const signOut = useCallback(async () => {
    session.clear()
    setToken(null)
    await client.clearStore()
  }, [client])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: token ? (data?.me ?? null) : null,
      loading: Boolean(token) && loading && !data,
      signIn,
      signOut,
    }),
    [token, data, loading, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
