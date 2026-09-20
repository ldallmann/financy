import { gql, type TypedDocumentNode } from '@apollo/client'
import { CATEGORY_FIELDS, TRANSACTION_FIELDS } from './queries'
import type { Category, CategoryInput, Transaction, TransactionInput, User } from './types'

type AuthPayload = { token: string; user: User }

export const REGISTER: TypedDocumentNode<{ register: AuthPayload }, { name: string; email: string; password: string }> = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
        createdAt
      }
    }
  }
`

export const LOGIN: TypedDocumentNode<{ login: AuthPayload }, { email: string; password: string }> = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        createdAt
      }
    }
  }
`

export const UPDATE_PROFILE: TypedDocumentNode<{ updateProfile: User }, { name: string }> = gql`
  mutation UpdateProfile($name: String!) {
    updateProfile(name: $name) {
      id
      name
      email
      createdAt
    }
  }
`

export const CREATE_CATEGORY: TypedDocumentNode<{ createCategory: Category }, { input: CategoryInput }> = gql`
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`

export const UPDATE_CATEGORY: TypedDocumentNode<{ updateCategory: Category }, { id: string; input: CategoryInput }> = gql`
  mutation UpdateCategory($id: ID!, $input: CategoryInput!) {
    updateCategory(id: $id, input: $input) {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`

export const DELETE_CATEGORY: TypedDocumentNode<{ deleteCategory: boolean }, { id: string }> = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`

export const CREATE_TRANSACTION: TypedDocumentNode<{ createTransaction: Transaction }, { input: TransactionInput }> = gql`
  mutation CreateTransaction($input: TransactionInput!) {
    createTransaction(input: $input) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`

export const UPDATE_TRANSACTION: TypedDocumentNode<
  { updateTransaction: Transaction },
  { id: string; input: TransactionInput }
> = gql`
  mutation UpdateTransaction($id: ID!, $input: TransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`

export const DELETE_TRANSACTION: TypedDocumentNode<{ deleteTransaction: boolean }, { id: string }> = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`
