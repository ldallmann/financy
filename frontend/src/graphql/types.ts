export type TransactionType = 'INCOME' | 'EXPENSE'

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface Category {
  id: string
  title: string
  description: string | null
  icon: string
  color: string
  createdAt: string
  transactionsCount: number
  transactionsTotal: number
}

export interface Transaction {
  id: string
  description: string
  type: TransactionType
  amount: number
  date: string
  createdAt: string
  categoryId: string | null
  category: Pick<Category, 'id' | 'title' | 'icon' | 'color'> | null
}

export interface TransactionsPage {
  items: Transaction[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface DashboardSummary {
  balance: number
  monthlyIncome: number
  monthlyExpenses: number
  month: number
  year: number
}

export interface CategoriesSummary {
  totalCategories: number
  totalTransactions: number
  mostUsedCategory: Pick<Category, 'id' | 'title' | 'icon' | 'color'> | null
}

export interface TransactionFilters {
  search?: string | null
  type?: TransactionType | null
  categoryId?: string | null
  month?: number | null
  year?: number | null
  page?: number | null
  perPage?: number | null
}

export interface CategoryInput {
  title: string
  description?: string | null
  icon: string
  color: string
}

export interface TransactionInput {
  description: string
  type: TransactionType
  amount: number
  date: string
  categoryId?: string | null
}
