import { Loader2 } from 'lucide-react'

export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100" role="status" aria-live="polite">
      <Loader2 className="animate-spin text-brand-base" size={32} />
      <span className="sr-only">Carregando…</span>
    </div>
  )
}
