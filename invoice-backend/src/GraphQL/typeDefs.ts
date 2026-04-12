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

  "Full serialized invoice state at a single revision."
  type InvoiceSnapshot {
    clientAddress: ClientAddress
    senderAddress: SenderAddress
    clientEmail: String
    clientName: String
    createdAt: String
    description: String
    items: [Item]
    paymentDue: String
    paymentTerms: Float
    status: String
    total: Float
  }

  type RevisionAuthor {
    id: String!
    username: String!
    name: String
  }

  "Immutable record describing one point in an invoice's edit history."
  type InvoiceRevision {
    id: ID!
    invoiceId: String!
    revisionNumber: Int!
    createdAt: String!
    createdBy: RevisionAuthor
    "One of: create, edit, restore"
    changeType: String!
    restoredFromRevisionId: String
    message: String
    snapshot: InvoiceSnapshot!
  }

  type ScalarFieldChange {
    field: String!
    before: String
    after: String
  }

  type AddressFieldChange {
    key: String!
    before: String
    after: String
  }

  type AddressChange {
    "Which address changed: clientAddress or senderAddress"
    field: String!
    changes: [AddressFieldChange!]!
  }

  type ItemChange {
    itemKey: String!
    "One of: added, removed, modified"
    changeType: String!
    before: Item
    after: Item
    fieldChanges: [ScalarFieldChange!]!
  }

  """
  Structured diff between two invoice revisions. The frontend renders this
  directly — no JSON-parsing required.
  """
  type InvoiceDiff {
    fromRevisionId: String
    toRevisionId: String!
    fieldChanges: [ScalarFieldChange!]!
    addressChanges: [AddressChange!]!
    itemChanges: [ItemChange!]!
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
    "Reverse-chronological revision history for an invoice."
    invoiceRevisions(invoiceId: String!): [InvoiceRevision!]!
    "Fetch a single revision by id, including its full snapshot."
    invoiceRevision(id: String!): InvoiceRevision
    """
    Structured diff between two revisions. Pass fromRevisionId=null to
    diff against the empty state (useful for the initial revision).
    """
    invoiceRevisionDiff(
      fromRevisionId: String
      toRevisionId: String!
    ): InvoiceDiff!
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

    removeInvoice(id: String!): deleteResult

    deleteAllInvoices: deleteResult

    deleteInvoicesByUserId(userId: String!): deleteResult

    markAsPaid(id: String!): Invoice

    """
    Restore an older revision as the current state. Append-only: this
    creates a NEW revision entry with changeType=restore rather than
    deleting any history.
    """
    restoreInvoiceRevision(invoiceId: String!, revisionId: String!): Invoice

    createUser(name: String, username: String!, password: String!): User

    deleteUsers: deleteResult

    deleteUsersKeepAdmins: deleteResult

    login(username: String!, password: String!): LoginResponse
  }

  type Subscription {
    invoiceAdded: Invoice!
  }
`;

export default typeDefs;
