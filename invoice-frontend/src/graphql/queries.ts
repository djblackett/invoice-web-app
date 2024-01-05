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
  mutation AddInvoice($clientEmail: String, $clientName: String, $createdAt: String, $description: String, $paymentDue: String, $paymentTerms: Float, $senderAddress: SenderInfo, $status: String, $total: Float, $id: String, $clientAddress: ClientInfo, $items: [ItemInput]) {
  addInvoice(clientEmail: $clientEmail, clientName: $clientName, createdAt: $createdAt, description: $description, paymentDue: $paymentDue, paymentTerms: $paymentTerms, senderAddress: $senderAddress, status: $status, total: $total, id: $id, clientAddress: $clientAddress, items: $items) {
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
    $editInvoiceId: String
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
      id: $editInvoiceId
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

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!, $name: String) {
    createUser(username: $username, password: $password, name: $name) {
      username
      id
    }
  }
`;

// export const ALL_INVOICES = gql`
//   query allInvoices {
//       senderAddress {
//           ...SenderInfo
//       }
//       clientAddress {
//           ...ClientInfo,
//       }
//       clientEmail,
//       clientName,
//       createdAt,
//       description,
//       id,
//       items,
//       paymentDue,
//       paymentTerms,
//       status,
//       total
//   }
//   ${SENDER_INFO}
//   ${CLIENT_INFO}
//
// `;

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
  query GetInvoiceById($id: String!) {
    getInvoiceById(id: $id) {
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

export const REMOVE_INVOICE = gql`
  mutation RemoveInvoice($removeInvoiceId: String!) {
    removeInvoice(id: $removeInvoiceId)
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
