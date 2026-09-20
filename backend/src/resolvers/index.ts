import { authResolvers } from './auth.js'
import { categoryResolvers } from './category.js'
import { transactionResolvers } from './transaction.js'

export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...categoryResolvers.Query,
    ...transactionResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...transactionResolvers.Mutation,
  },
  User: authResolvers.User,
  Category: categoryResolvers.Category,
  Transaction: transactionResolvers.Transaction,
}
