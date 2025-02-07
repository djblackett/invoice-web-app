import { gql } from "graphql-tag";

const typeDefs = gql`
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }

  type User {
    username: String!
    id: String!
  }

  type Token {
    value: String!
  }

  type LoginResponse {
    user: User
    token: String!
  }

  type Invoice {
    createdBy: User
    clientAddress: ClientAddress
    clientEmail: String
    clientName: String
    createdAt: String
    description: String
    id: String
    items: [Item]
    paymentDue: String
    paymentTerms: Float
    senderAddress: SenderAddress
    status: String
    total: Float
  }

  type SenderAddress {
    city: String
    country: String
    postCode: String
    street: String
  }

  type ClientAddress {
    city: String
    country: String
    postCode: String
    street: String
  }

  type Item {
    id: String
    name: String
    price: Float
    quantity: Int
    total: Float
  }

  type deleteResult {
    acknowledged: Boolean
  }

  input ClientInfo {
    city: String
    country: String
    postCode: String
    street: String
  }

  input SenderInfo {
    city: String
    country: String
    postCode: String
    street: String
  }

  input ItemInput {
    id: String
    name: String
    price: Float
    quantity: Int
    total: Float
  }

  type Query {
    allInvoices: [Invoice]
    getInvoiceById(id: String!): Invoice
    getAllClientAddresses: [ClientAddress]
    getAllSenderAddresses: [SenderAddress]
    allUsers: [User]
    getUserById(id: String!): User
    me: User
  }

  type Mutation {
    addInvoice(
      clientAddress: ClientInfo
      clientEmail: String
      clientName: String
      createdAt: String
      description: String
      id: String
      items: [ItemInput]
      paymentDue: String
      paymentTerms: Float
      senderAddress: SenderInfo
      status: String
      total: Float
    ): Invoice

    editInvoice(
      clientAddress: ClientInfo
      clientEmail: String
      clientName: String
      createdAt: String
      description: String
      id: String
      items: [ItemInput]
      paymentDue: String
      paymentTerms: Float
      senderAddress: SenderInfo
      status: String
      total: Float
    ): Invoice

    removeInvoice(id: String!): String

    deleteAllInvoices: deleteResult

    deleteInvoicesByUserId(userId: String!): deleteResult

    markAsPaid(id: String!): Invoice

    createUser(name: String, username: String!, password: String!): User

    deleteUsers: deleteResult

    login(username: String!, password: String!): LoginResponse
  }

  type Subscription {
    invoiceAdded: Invoice!
  }
`;

export default typeDefs;
