import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { canonicalDemoRecords } from "../../prisma/demoWorkspace.cjs";
import type { DbClient } from "../database/database.connection";

/**
 * Builds the canonical seven-invoice, eleven-revision workspace for `userId`
 * inside the caller's transaction. Every internal ID is new and globally
 * unique (invoice, item and revision IDs, including IDs embedded in revision
 * snapshots), so no temporary workspace ever shares a row ID with the shared
 * demo or another visitor. The invoice ID keeps the canonical prefix
 * (`RT3080-<uuid>`), which is what keeps the familiar invoice numbers visible.
 * Used by allocation and reset, so the two can never drift apart.
 */
export async function insertCanonicalWorkspace(tx: DbClient, userId: string) {
  for (const record of canonicalDemoRecords()) {
    const invoiceId = `${record.id}-${randomUUID()}`;
    // One mapping across current items AND historical-only items. Never leave
    // a canonical/shared item ID inside an otherwise isolated snapshot.
    const itemIds = new Map<string, string>();
    const remap = (snapshot: typeof record.invoice) => ({
      ...snapshot,
      items: snapshot.items.map((item) => {
        let id = itemIds.get(item.id);
        if (!id) {
          id = randomUUID();
          itemIds.set(item.id, id);
        }
        return { ...item, id };
      }),
    });
    const { items, clientAddress, senderAddress, ...fields } = remap(
      record.invoice,
    );
    await tx.invoice.create({
      data: {
        ...fields,
        id: invoiceId,
        createdBy: { connect: { id: userId } },
        items: { create: items },
        clientAddress: { create: clientAddress },
        senderAddress: { create: senderAddress },
      },
    });
    await tx.invoiceRevision.createMany({
      data: record.snapshots.map((snapshot, index) => ({
        id: randomUUID(),
        invoiceId,
        revisionNumber: index + 1,
        createdById: userId,
        changeType: index === 0 ? "create" : "edit",
        message:
          record.id === "RT3080"
            ? ([
                "Initial draft created",
                "Added logo design deliverable",
                "Increased brand guidelines price",
                "Sent to client, pending payment",
                "Marked as paid",
              ].at(index) ?? "Invoice created")
            : "Invoice created",
        createdAt: new Date(Date.UTC(2021, 7, 18, 12, index)),
        snapshot: remap(snapshot) as unknown as Prisma.InputJsonObject,
      })),
    });
  }
}

/**
 * Deletes exactly `userId`'s invoices (items and revisions cascade) and the
 * addresses those invoices referenced, but only addresses no other invoice
 * still references. Never touches the user, the session, or any other
 * workspace. The caller must hold the session's row lock.
 */
export async function clearWorkspace(tx: DbClient, userId: string) {
  const invoices = await tx.invoice.findMany({
    where: { createdById: userId },
    select: { clientAddressId: true, senderAddressId: true },
  });
  await tx.invoice.deleteMany({ where: { createdById: userId } });
  await tx.clientAddress.deleteMany({
    where: {
      id: {
        in: invoices.flatMap((i) =>
          i.clientAddressId === null ? [] : [i.clientAddressId],
        ),
      },
      Invoice: { is: null },
    },
  });
  await tx.senderAddress.deleteMany({
    where: {
      id: {
        in: invoices.flatMap((i) =>
          i.senderAddressId === null ? [] : [i.senderAddressId],
        ),
      },
      Invoice: { is: null },
    },
  });
}
