const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
})

export function formatCurrency(cents: number): string {
  return currency.format(cents / 100)
}

export function formatSignedCurrency(cents: number, type: 'INCOME' | 'EXPENSE'): string {
  return `${type === 'INCOME' ? '+' : '-'} ${formatCurrency(Math.abs(cents))}`
}

export function centsToInput(cents: number): string {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100)
}

export const MAX_AMOUNT_CENTS = 2_147_483_647

export function inputToCents(value: string): number {
  const digits = value.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
  if (!digits) return 0
  return Math.min(Number.parseInt(digits, 10), MAX_AMOUNT_CENTS)
}

export function formatShortDate(iso: string): string {
  const date = new Date(iso)
  const dd = String(date.getUTCDate()).padStart(2, '0')
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0')
  const yy = String(date.getUTCFullYear()).slice(-2)
  return `${dd}/${mm}/${yy}`
}

export function isoToDateInput(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10)
}

export function todayDateInput(): string {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

export function formatMonthYear(month: number, year: number): string {
  return `${MONTHS[month - 1]} / ${year}`
}

export function formatItems(count: number): string {
  return `${count} ${count === 1 ? 'item' : 'itens'}`
}
