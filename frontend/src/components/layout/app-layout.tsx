import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '@/contexts/auth'
import { Navbar } from './navbar'
import { PageLoader } from './page-loader'

export function AppLayout() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/" replace state={{ from: location }} />

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Navbar />
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-8 md:px-12 md:py-12">
        <Outlet />
      </main>
    </div>
  )
}
