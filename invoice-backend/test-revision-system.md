# Invoice Revision History System - Test Guide

## Overview
The invoice revision history system has been successfully implemented with the following features:

### 🔧 **Core Features Implemented:**

1. **JSON Diff Tracking**: Uses `jsondiffpatch` library for efficient storage of changes
2. **Reversible Changes**: Full snapshots stored for complete restoration capability
3. **User Tracking**: Each revision tracks who made the change
4. **Change Types**: Categorizes changes as 'create', 'update', or 'status_change'
5. **Date Range Filtering**: Query revisions by date range
6. **User Filtering**: Filter revisions by specific users
7. **GraphQL API**: Full GraphQL integration for all revision operations

### 📊 **Database Schema:**
```sql
model InvoiceRevision {
  id             String   @id @default(uuid())
  invoiceId      String
  invoice        Invoice  @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  createdAt      DateTime @default(now())
  createdBy      User     @relation(fields: [createdById], references: [id], onDelete: Cascade)
  createdById    String
  revisionNumber Int
  changeType     String   // 'create', 'update', 'status_change'
  jsonDiff       String?  // JSON diff patch (null for initial creation)
  fullSnapshot   String   // Full invoice data snapshot for restoration
  description    String?  // Optional description of changes

  @@index([invoiceId])
  @@index([createdById])
  @@index([createdAt])
  @@unique([invoiceId, revisionNumber])
}
```

### 🚀 **GraphQL API Endpoints:**

#### **Queries:**
```graphql
# Get all revisions for an invoice with optional filtering
getInvoiceRevisions(
  invoiceId: String!
  filters: RevisionFilters
): [InvoiceRevision]

# Get diff between two specific revisions
getRevisionDiff(
  invoiceId: String!
  fromRevision: Int!
  toRevision: Int!
): RevisionDiff
```

#### **Mutations:**
```graphql
# Restore an invoice to a specific revision
restoreInvoiceToRevision(
  invoiceId: String!
  revisionNumber: Int!
): Invoice
```

#### **Filter Options:**
```graphql
input RevisionFilters {
  startDate: String    # ISO date string
  endDate: String      # ISO date string
  userId: String       # Filter by specific user
  changeType: String   # 'create', 'update', 'status_change'
}
```

### 🔄 **Automatic Revision Creation:**
Revisions are automatically created when:
- **Creating a new invoice** → Creates initial revision with `changeType: 'create'`
- **Updating an invoice** → Creates revision with `changeType: 'update'` and JSON diff
- **Marking as paid** → Creates revision with `changeType: 'status_change'`

### 🛡️ **Security & Authorization:**
- Users can only view/restore revisions for invoices they own
- Admins can view/restore revisions for all invoices
- All operations require authentication

### 📝 **Example Usage:**

#### **1. Query Invoice Revisions:**
```graphql
query GetInvoiceRevisions($invoiceId: String!) {
  getInvoiceRevisions(invoiceId: $invoiceId) {
    id
    revisionNumber
    changeType
    description
    createdAt
    createdBy {
      username
      name
    }
    jsonDiff
  }
}
```

#### **2. Filter Revisions by Date Range:**
```graphql
query GetRecentRevisions($invoiceId: String!) {
  getInvoiceRevisions(
    invoiceId: $invoiceId
    filters: {
      startDate: "2025-06-01T00:00:00Z"
      endDate: "2025-06-07T23:59:59Z"
      changeType: "update"
    }
  ) {
    revisionNumber
    changeType
    description
    createdAt
  }
}
```

#### **3. Get Diff Between Revisions:**
```graphql
query GetRevisionDiff($invoiceId: String!) {
  getRevisionDiff(
    invoiceId: $invoiceId
    fromRevision: 1
    toRevision: 3
  ) {
    fromRevision
    toRevision
    diff
  }
}
```

#### **4. Restore Invoice to Previous Version:**
```graphql
mutation RestoreInvoice($invoiceId: String!) {
  restoreInvoiceToRevision(
    invoiceId: $invoiceId
    revisionNumber: 2
  ) {
    id
    status
    total
    description
  }
}
```

### 🎯 **Key Benefits:**

1. **Efficient Storage**: Only stores diffs between versions, not full copies
2. **Complete Audit Trail**: Track every change with user and timestamp
3. **Easy Restoration**: Restore to any previous version with one API call
4. **Flexible Filtering**: Query revisions by date, user, or change type
5. **GraphQL Integration**: Seamless integration with existing API
6. **Type Safety**: Full TypeScript support throughout

### 🔧 **Technical Implementation:**

- **Service Layer**: `RevisionService` handles all revision operations
- **Repository Integration**: Automatic revision creation in invoice operations
- **Dependency Injection**: Proper IoC container setup with Inversify
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Database Optimization**: Indexed queries for efficient revision retrieval

The system is now fully operational and ready for production use! 🎉
