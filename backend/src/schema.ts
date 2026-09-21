export const typeDefs = `
  enum TransactionType {
    INCOME
    EXPENSE
  }

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Category {
    id: ID!
    title: String!
    description: String
    icon: String!
    color: String!
    createdAt: String!
    transactionsCount: Int!
    "Soma em centavos"
    transactionsTotal: Float!
  }

  type Transaction {
    id: ID!
    description: String!
    type: TransactionType!
    "Valor em centavos"
    amount: Int!
    "Data no formato ISO 8601"
    date: String!
    createdAt: String!
    categoryId: ID
    category: Category
  }

  type TransactionsPage {
    items: [Transaction!]!
    total: Int!
    page: Int!
    perPage: Int!
    totalPages: Int!
  }

  type DashboardSummary {
    "Valores em centavos"
    balance: Float!
    monthlyIncome: Float!
    monthlyExpenses: Float!
    month: Int!
    year: Int!
  }

  type CategoriesSummary {
    totalCategories: Int!
    totalTransactions: Int!
    mostUsedCategory: Category
  }

  input TransactionFilters {
    search: String
    type: TransactionType
    categoryId: ID
    month: Int
    year: Int
    page: Int = 1
    perPage: Int = 10
  }

  input CategoryInput {
    title: String!
    description: String
    icon: String!
    color: String!
  }

  input TransactionInput {
    description: String!
    type: TransactionType!
    "Valor em centavos"
    amount: Int!
    "Data no formato ISO 8601"
    date: String!
    categoryId: ID
  }

  type Query {
    me: User
    categories: [Category!]!
    categoriesSummary: CategoriesSummary!
    transactions(filters: TransactionFilters): TransactionsPage!
    recentTransactions(limit: Int = 5): [Transaction!]!
    dashboardSummary(month: Int, year: Int): DashboardSummary!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateProfile(name: String!): User!

    createCategory(input: CategoryInput!): Category!
    updateCategory(id: ID!, input: CategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!

    createTransaction(input: TransactionInput!): Transaction!
    updateTransaction(id: ID!, input: TransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!
  }
`
