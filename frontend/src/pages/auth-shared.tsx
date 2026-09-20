export function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-1 text-center">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      <p className="text-base text-gray-600">{subtitle}</p>
    </div>
  )
}

export function AuthDivider() {
  return (
    <div className="flex items-center gap-3" aria-hidden>
      <span className="h-px flex-1 bg-gray-300" />
      <span className="text-sm text-gray-500">ou</span>
      <span className="h-px flex-1 bg-gray-300" />
    </div>
  )
}
