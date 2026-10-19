# Synthetic acceptance address cleanup — proposal only

**Separate authorization is required before executing production cleanup.**
This task performed only the targeted read-only production verification below;
it made no production mutation or Fly operation. The application fix does not
remove existing orphan rows.

## Exact candidates and evidence

The 2026-10-19 public acceptance run at production commit
`eec166fcc56766d329cd627084b9f9b2d23ff0f6` created and deleted invoice `VE5744`.
Its final read-only integrity inspection recorded these synthetic leftovers:

| Table and primary key | Expected street | City | Postcode | Country |
| --- | --- | --- | --- | --- |
| `ClientAddress.id = 16` | `42 Synthetic Client Lane` | Dartmouth | B2Y 1A1 | Canada |
| `SenderAddress.id = 16` | `123 Synthetic Test Street` | Halifax | B3J 1A1 | Canada |

Local acceptance artifacts inspected while preparing this proposal:

- `/tmp/invoice-public-acceptance-2026-10-19.md`: identifies both residual IDs.
  SHA-256: `7c1cb65724f9cfcb5c7859cdb4b3c37af39327647c73717513b5028aa34e99f7`.
- `/tmp/invoice-acceptance-after-integrity.json`: `newUnattachedAddresses`
  contains `ClientAddress: [16]` and `SenderAddress: [16]`.
  SHA-256: `0303c26abb7794cd7ca1891b672b3f6711441382aee003afc1466c0fe9929135`.
- `/tmp/invoice-public-acceptance.cjs`: records the synthetic address fields.
  SHA-256: `ccbbb2da7d286aa1588a634d2db15ac1b1206d09d1c9b444e98a6da4cf65715a`.

At **2026-10-19 04:08:45 America/Halifax** (07:08:45 UTC), a fresh REPEATABLE
READ, READ ONLY transaction confirmed that both exact rows still exist, all
four fields match the table above, and each has **zero invoice references**.
The connection identity fingerprint matched acceptance evidence for existing
project `square-mouse-54724886`, production branch `br-dawn-bird-b5l2mc95`,
database `neondb`, schema `public`; `transaction_read_only` reported `on`.
Only these two candidates and their reference counts were queried.

Fresh verification evidence is in
`/tmp/invoice-address-fix/production-candidates-readonly.json`. Preserve these
ephemeral evidence artifacts with the cleanup approval record. Reference status
can change: repeat the following verification immediately before any separately
authorized removal.

## Read-only verification for the separately authorized session

Confirm the intended existing `invoice-app` production branch and database
identity using trusted operational evidence, then run a read-only transaction:

```sql
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY;
SELECT current_database(), current_schema();
SELECT 'ClientAddress' AS source, a.*,
       EXISTS (SELECT 1 FROM "Invoice" i WHERE i."clientAddressId" = a.id) AS referenced
FROM "ClientAddress" a WHERE a.id = 16;
SELECT 'SenderAddress' AS source, a.*,
       EXISTS (SELECT 1 FROM "Invoice" i WHERE i."senderAddressId" = a.id) AS referenced
FROM "SenderAddress" a WHERE a.id = 16;
ROLLBACK;
```

Proceed only if each exact candidate exists once, all four address fields match
the synthetic evidence above, and both `referenced` results are false. A missing,
changed or referenced row requires stopping and revising the proposal. Do not
substitute another ID or infer that any other orphan is safe to remove.

## Proposed removal after explicit approval

Use one short transaction against the verified database. Acquire `SHARE` table
locks on `Invoice`, `ClientAddress` and `SenderAddress` in a consistent order to
exclude concurrent invoice references and address changes, then repeat the
exact-ID, full-field and reference checks under those locks. These locks briefly
block writes; schedule the operation accordingly.

Delete only `ClientAddress.id = 16` and `SenderAddress.id = 16`, each with all
four expected fields and a `NOT EXISTS` invoice-reference predicate in its WHERE
clause. Use `RETURNING` to record both deleted rows. Require exactly one returned
row per table, enforced with an exception inside the transaction if either
count differs, so a failure rolls back both deletions. Commit only after those
checks pass. The reference checks and locks are essential because deleting an
address with a reference would otherwise cascade to its invoice.

After commit, verify just these two IDs are absent and that invoice, item,
revision and user rows match the pre-cleanup snapshot. Retain the identity,
approval, returned rows and verification record. Do not reseed, reset Demo,
alter sequences, run migrations, or perform a global orphan cleanup as part of
this operation.
