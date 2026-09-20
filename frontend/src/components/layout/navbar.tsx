import { Link, NavLink } from 'react-router'
import { Avatar } from '@/components/ui/avatar'
import { Logo } from '@/components/ui/logo'
import { useAuth } from '@/contexts/auth'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/transacoes', label: 'Transações' },
  { to: '/categorias', label: 'Categorias' },
]

export function Navbar() {
  const { user } = useAuth()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="relative mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-6 md:px-12">
        <Link to="/" aria-label="Ir para o dashboard" className="shrink-0">
          <Logo height={24} />
        </Link>

        <nav aria-label="Principal" className="absolute left-1/2 flex -translate-x-1/2 items-center gap-5 text-sm">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn('transition-colors hover:text-gray-800', isActive ? 'font-semibold text-brand-base' : 'text-gray-600')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/perfil"
          aria-label="Meu perfil"
          className="rounded-full focus-visible:ring-2 focus-visible:ring-brand-base/40 focus-visible:outline-none"
        >
          <Avatar name={user?.name ?? ''} />
        </Link>
      </div>
    </header>
  )
}
