import { Navigate, Outlet } from 'react-router'
import { Card } from '@/components/ui/card'
import { Logo } from '@/components/ui/logo'
import { useAuth } from '@/contexts/auth'
import { PageLoader } from './page-loader'

export function AuthLayout() {
  const { user, loading } = useAuth()

  if (loading) return <PageLoader />
  if (user) return <Navigate to="/" replace />

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-gray-100 px-4 py-12">
      <Logo height={32} />
      <Card className="w-full max-w-[448px] p-8">
        <Outlet />
      </Card>
    </div>
  )
}
