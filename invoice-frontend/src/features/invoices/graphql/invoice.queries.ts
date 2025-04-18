import { gql } from "@apollo/client";

export const CLIENT_INFO = gql`
  fragment ClientInfo on ClientAddress {
    city
    country
    postCode
    street
  }
`;

export const SENDER_INFO = gql`
  fragment SenderInfo on SenderAddress {
    city
    country
    postCode
    street
  }
`;

export const INVOICE_DETAILS = gql`
  fragment InvoiceDetails on Invoice {
    clientAddress {
      city
      country
      postCode
      street
    }
    clientEmail
    clientName
    createdAt
    description
    id
    items {
      id
      name
      price
      quantity
      total
    }
    paymentDue
    paymentTerms
    senderAddress {
      city
      country
      postCode
      street
    }
    status
    total
  }
`;

export const ADD_INVOICE = gql`
  mutation addInvoice(
    $clientEmail: String
    $clientAddress: ClientInfo
    $clientName: String
    $createdAt: String
    $description: String
    $id: String
    $items: [ItemInput]
    $paymentDue: String
    $paymentTerms: Float
    $senderAddress: SenderInfo
    $status: String
    $total: Float
  ) {
    addInvoice(
      clientEmail: $clientEmail
      clientAddress: $clientAddress
      clientName: $clientName
      createdAt: $createdAt
      description: $description
      id: $id
      items: $items
      paymentDue: $paymentDue
      paymentTerms: $paymentTerms
      senderAddress: $senderAddress
      status: $status
      total: $total
    ) {
      clientAddress {
        city
        country
        postCode
        street
      }
      clientEmail
      clientName
      createdAt
      description
      id
      items {
        id
        name
        price
        quantity
        total
      }
      paymentDue
      paymentTerms
      senderAddress {
        city
        country
        postCode
        street
      }
      status
      total
    }
  }
`;

export const EDIT_INVOICE = gql`
  mutation editInvoice(
    $clientAddress: ClientInfo
    $clientEmail: String
    $clientName: String
    $createdAt: String
    $description: String
    $id: String
    $items: [ItemInput]
    $paymentDue: String
    $paymentTerms: Float
    $senderAddress: SenderInfo
    $status: String
    $total: Float
  ) {
    editInvoice(
      clientAddress: $clientAddress
      clientEmail: $clientEmail
      clientName: $clientName
      createdAt: $createdAt
      description: $description
      id: $id
      items: $items
      paymentDue: $paymentDue
      paymentTerms: $paymentTerms
      senderAddress: $senderAddress
      status: $status
      total: $total
    ) {
      clientAddress {
        city
        country
        postCode
        street
      }
      clientEmail
      clientName
      createdAt
      description
      id
      items {
        id
        name
        price
        quantity
        total
      }
      paymentDue
      paymentTerms
      senderAddress {
        city
        country
        postCode
        street
      }
      status
      total
      __typename
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!, $name: String) {
    createUser(username: $username, password: $password, name: $name) {
      username
      id
    }
  }
`;

export const ALL_INVOICES = gql`
  query allInvoices {
    allInvoices {
      clientAddress {
        city
        country
        postCode
        street
      }
      clientEmail
      clientName
      createdAt
      description
      id
      items {
        id
        name
        price
        quantity
        total
      }
      paymentDue
      paymentTerms
      senderAddress {
        city
        country
        postCode
        street
      }
      status
      total
    }
  }
`;

export const GET_INVOICE_BY_ID = gql`
  query GetInvoiceById($getInvoiceById: String!) {
    getInvoiceById(id: $getInvoiceById) {
      clientAddress {
        city
        country
        postCode
        street
      }
      clientEmail
      clientName
      createdAt
      description
      id
      items {
        id
        name
        price
        quantity
        total
      }
      paymentDue
      paymentTerms
      senderAddress {
        city
        country
        postCode
        street
      }
      status
      total
      __typename
    }
  }
`;

export const REMOVE_INVOICE = gql`
  mutation RemoveInvoice($removeInvoiceId: String!) {
    removeInvoice(id: $removeInvoiceId) {
      acknowledged
    }
  }
`;

export const DELETE_ALL_INVOICES = gql`
  mutation DeleteAllInvoices {
    deleteAllInvoices {
      acknowledged
    }
  }
`;

export const MARK_AS_PAID = gql`
  mutation MarkAsPaid($markAsPaidId: String!) {
    markAsPaid(id: $markAsPaidId) {
      clientAddress {
        city
        country
        postCode
        street
      }
      clientEmail
      clientName
      createdAt
      description
      id
      items {
        id
        name
        price
        quantity
        total
      }
      paymentDue
      paymentTerms
      senderAddress {
        city
        country
        postCode
        street
      }
      status
      total
    }
  }
`;

export const INVOICE_ADDED = gql`
  subscription {
    invoiceAdded {
      ...InvoiceDetails
    }
  }
  ${INVOICE_DETAILS}
`;

export const ME = gql`
  query {
    me {
      username
    }
  }
`;
