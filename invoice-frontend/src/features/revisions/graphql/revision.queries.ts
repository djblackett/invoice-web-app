import { gql } from "@apollo/client";

/**
 * GraphQL operations for invoice revision history. The types returned here
 * match the backend `InvoiceRevision` / `InvoiceDiff` schema in typeDefs.ts.
 */

export const REVISION_AUTHOR_FRAGMENT = gql`
  fragment RevisionAuthor on RevisionAuthor {
    id
    username
    name
  }
`;

export const INVOICE_SNAPSHOT_FRAGMENT = gql`
  fragment InvoiceSnapshotData on InvoiceSnapshot {
    clientEmail
    clientName
    createdAt
    description
    paymentDue
    paymentTerms
    status
    total
    clientAddress {
      city
      country
      postCode
      street
    }
    senderAddress {
      city
      country
      postCode
      street
    }
    items {
      id
      name
      price
      quantity
      total
    }
  }
`;

export const INVOICE_REVISION_FRAGMENT = gql`
  fragment InvoiceRevisionData on InvoiceRevision {
    id
    invoiceId
    revisionNumber
    createdAt
    changeType
    restoredFromRevisionId
    message
    createdBy {
      ...RevisionAuthor
    }
    snapshot {
      ...InvoiceSnapshotData
    }
  }
  ${REVISION_AUTHOR_FRAGMENT}
  ${INVOICE_SNAPSHOT_FRAGMENT}
`;

export const INVOICE_REVISIONS = gql`
  query InvoiceRevisions($invoiceId: String!) {
    invoiceRevisions(invoiceId: $invoiceId) {
      ...InvoiceRevisionData
    }
  }
  ${INVOICE_REVISION_FRAGMENT}
`;

export const INVOICE_REVISION_DIFF = gql`
  query InvoiceRevisionDiff(
    $fromRevisionId: String
    $toRevisionId: String!
  ) {
    invoiceRevisionDiff(
      fromRevisionId: $fromRevisionId
      toRevisionId: $toRevisionId
    ) {
      fromRevisionId
      toRevisionId
      fieldChanges {
        field
        before
        after
      }
      addressChanges {
        field
        changes {
          key
          before
          after
        }
      }
      itemChanges {
        itemKey
        changeType
        before {
          id
          name
          price
          quantity
          total
        }
        after {
          id
          name
          price
          quantity
          total
        }
        fieldChanges {
          field
          before
          after
        }
      }
    }
  }
`;

export const RESTORE_INVOICE_REVISION = gql`
  mutation RestoreInvoiceRevision(
    $invoiceId: String!
    $revisionId: String!
  ) {
    restoreInvoiceRevision(
      invoiceId: $invoiceId
      revisionId: $revisionId
    ) {
      id
      clientEmail
      clientName
      createdAt
      description
      paymentDue
      paymentTerms
      status
      total
      clientAddress {
        city
        country
        postCode
        street
      }
      senderAddress {
        city
        country
        postCode
        street
      }
      items {
        id
        name
        price
        quantity
        total
      }
    }
  }
`;
