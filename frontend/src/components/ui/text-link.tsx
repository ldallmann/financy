import { ChevronRight, type LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/utils'

const base =
  'inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-brand-base transition-colors hover:text-brand-dark hover:underline focus-visible:outline-none focus-visible:underline'

type Common = { chevron?: boolean; icon?: LucideIcon; className?: string; children: React.ReactNode }

export function TextLink({ chevron, icon: Icon, className, children, ...props }: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={cn(base, className)} {...props}>
      {Icon && <Icon size={20} />}
      {children}
      {chevron && <ChevronRight size={20} />}
    </Link>
  )
}

export function TextButton({ chevron, icon: Icon, className, children, ...props }: Common & ComponentProps<'button'>) {
  return (
    <button type="button" className={cn(base, className)} {...props}>
      {Icon && <Icon size={20} />}
      {children}
      {chevron && <ChevronRight size={20} />}
    </button>
  )
}
