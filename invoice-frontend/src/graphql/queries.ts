import {gql} from "@apollo/client";

export const CLIENT_INFO = gql`
    fragment ClientInfo on ClientAddress {
        city,
        country,
        postCode
        street
    }
`;

export const SENDER_INFO = gql`
    fragment SenderInfo on SenderAddress {
        city,
        country,
        postCode
        street
    }
`;

export const ADD_INVOICE = gql`
    mutation addInvoice(
        $clientEmail: String,
        $clientAddress: ClientAddress,
        $clientName: String,
        $createdAt: String,
        $description: String,
        $id: String,
        $items: [Item],
        $paymentDue: String,
        $paymentTerms: Float,
        $senderAddress: SenderAddress,
        $status: String,
        $total: Float
    ) {
      addInvoice(
       clientEmail: $clientEmail,
        clientAddress: $clientAddress,
        clientName: $clientName,
        createdAt: $createdAt,
        description: $description,
        id: $id,
        items: $items,
        paymentDue: $paymentDue,
        paymentTerms: $paymentTerms,
        senderAddress: $senderAddress,
        status: $status,
        total: $total
      )
    }
`;

export const EDIT_INVOICE = gql`
  mutation editInvoice($clientAddress: ClientInfo, $clientEmail: String, $clientName: String, $createdAt: String, $description: String, $editInvoiceId: String, $items: [ItemInput], $paymentDue: String, $paymentTerms: Float, $senderAddress: SenderInfo, $status: String, $total: Float) {
  editInvoice(clientAddress: $clientAddress, clientEmail: $clientEmail, clientName: $clientName, createdAt: $createdAt, description: $description, id: $editInvoiceId, items: $items, paymentDue: $paymentDue, paymentTerms: $paymentTerms, senderAddress: $senderAddress, status: $status, total: $total) {
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

export const ALL_INVOICES = gql`
  query allInvoices {
      senderAddress {
          ...SenderInfo
      }
      clientAddress {
          ...ClientInfo,
      }
      clientEmail,
      clientName,
      createdAt,
      description,
      id,
      items,
      paymentDue,
      paymentTerms,
      status,
      total
  }

`;