import { gql, type TypedDocumentNode } from '@apollo/client'
import type {
  CategoriesSummary,
  Category,
  DashboardSummary,
  Transaction,
  TransactionFilters,
  TransactionsPage,
  User,
} from './types'

export const CATEGORY_FIELDS = gql`
  fragment CategoryFields on Category {
    id
    title
    description
    icon
    color
    createdAt
    transactionsCount
    transactionsTotal
  }
`

export const TRANSACTION_FIELDS = gql`
  fragment TransactionFields on Transaction {
    id
    description
    type
    amount
    date
    createdAt
    categoryId
    category {
      id
      title
      icon
      color
    }
  }
`

export const ME: TypedDocumentNode<{ me: User | null }> = gql`
  query Me {
    me {
      id
      name
      email
      createdAt
    }
  }
`

export const CATEGORIES: TypedDocumentNode<{ categories: Category[] }> = gql`
  query Categories {
    categories {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`

export const CATEGORIES_SUMMARY: TypedDocumentNode<{ categoriesSummary: CategoriesSummary }> = gql`
  query CategoriesSummary {
    categoriesSummary {
      totalCategories
      totalTransactions
      mostUsedCategory {
        id
        title
        icon
        color
      }
    }
  }
`

export const TRANSACTIONS: TypedDocumentNode<{ transactions: TransactionsPage }, { filters?: TransactionFilters }> = gql`
  query Transactions($filters: TransactionFilters) {
    transactions(filters: $filters) {
      total
      page
      perPage
      totalPages
      items {
        ...TransactionFields
      }
    }
  }
  ${TRANSACTION_FIELDS}
`

export const DASHBOARD: TypedDocumentNode<
  { dashboardSummary: DashboardSummary; recentTransactions: Transaction[]; categories: Category[] },
  { limit?: number }
> = gql`
  query Dashboard($limit: Int) {
    dashboardSummary {
      balance
      monthlyIncome
      monthlyExpenses
      month
      year
    }
    recentTransactions(limit: $limit) {
      ...TransactionFields
    }
    categories {
      ...CategoryFields
    }
  }
  ${TRANSACTION_FIELDS}
  ${CATEGORY_FIELDS}
`
