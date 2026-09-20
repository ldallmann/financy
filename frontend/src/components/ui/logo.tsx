import logo from '@/assets/logo.svg'
import { cn } from '@/lib/utils'

export function Logo({ height = 32, className }: { height?: number; className?: string }) {
  const width = Math.round((height * 134) / 32)
  return <img src={logo} alt="Financy" width={width} height={height} className={cn('block', className)} />
}
