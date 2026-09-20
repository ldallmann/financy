import { Navigate, Route, Routes } from 'react-router'
import { AppLayout } from '@/components/layout/app-layout'
import { AuthLayout } from '@/components/layout/auth-layout'
import { PageLoader } from '@/components/layout/page-loader'
import { useAuth } from '@/contexts/auth'
import { CategoriesPage } from '@/pages/categories'
import { DashboardPage } from '@/pages/dashboard'
import { LoginPage } from '@/pages/login'
import { ProfilePage } from '@/pages/profile'
import { RegisterPage } from '@/pages/register'
import { TransactionsPage } from '@/pages/transactions'

function Home() {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  return user ? (
    <AppLayout />
  ) : (
    <AuthLayout />
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route index element={<HomeIndex />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/cadastro" element={<RegisterPage />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path="/transacoes" element={<TransactionsPage />} />
        <Route path="/categorias" element={<CategoriesPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function HomeIndex() {
  const { user } = useAuth()
  return user ? <DashboardPage /> : <LoginPage />
}
