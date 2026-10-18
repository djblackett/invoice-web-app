/**
 * Types mirroring the backend InvoiceRevision / InvoiceDiff GraphQL schema.
 * Kept as a local copy rather than auto-generated (this repo doesn't use
 * GraphQL codegen for its app types) so the compiler enforces the shape.
 */

export interface RevisionAuthor {
  id: string;
  username: string;
  name: string | null;
}

export interface SnapshotAddress {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface SnapshotItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface InvoiceSnapshot {
  clientAddress: SnapshotAddress;
  senderAddress: SnapshotAddress;
  clientEmail: string;
  clientName: string;
  createdAt: string;
  description: string;
  items: SnapshotItem[];
  paymentDue: string;
  paymentTerms: number;
  status: string;
  total: number;
}

export type ChangeType = "create" | "edit" | "restore";

export interface InvoiceRevision {
  id: string;
  invoiceId: string;
  revisionNumber: number;
  createdAt: string;
  changeType: ChangeType;
  restoredFromRevisionId: string | null;
  message: string | null;
  createdBy: RevisionAuthor | null;
  snapshot: InvoiceSnapshot;
}

export interface ScalarFieldChange {
  field: string;
  before: string | null;
  after: string | null;
}

export interface AddressFieldChange {
  key: "street" | "city" | "postCode" | "country";
  before: string;
  after: string;
}

export interface AddressChange {
  field: "clientAddress" | "senderAddress";
  changes: AddressFieldChange[];
}

export interface ItemChange {
  itemKey: string;
  changeType: "added" | "removed" | "modified";
  before: SnapshotItem | null;
  after: SnapshotItem | null;
  fieldChanges: ScalarFieldChange[];
}

export interface InvoiceDiff {
  fromRevisionId: string | null;
  toRevisionId: string;
  fieldChanges: ScalarFieldChange[];
  addressChanges: AddressChange[];
  itemChanges: ItemChange[];
}
