// Shared by the plain-Node seed and the application service. Keeping the
// canonical data independent of DI lets both paths use exactly the same reset.
const templates = require("./demoInvoices.json");
const DEMO_ID = "demoId";
const DEMO_USER = /** @type {const} */ ({
  id: DEMO_ID,
  role: "USER",
  name: "demo-user",
  username: "demo-user@example.com",
});

/** @typedef {import('../src/services/invoiceDiff').InvoiceSnapshot} Snapshot */

function canonicalDemoRecords() {
  return templates.map((template) => {
    const { id, ...fields } = template;
    /** @type {Snapshot} */
    let state = {
      ...fields,
      items: fields.items.map((item, index) => ({
        ...item,
        id: `demo-${id}-item-${index + 1}`,
      })),
    };
    /** @type {Snapshot[]} */
    const snapshots = [];
    if (id === "RT3080") {
      state = {
        ...state,
        status: "draft",
        description: "Website re-brand (draft)",
        items: [
          {
            id: `demo-${id}-item-1`,
            name: "Brand Guidelines",
            price: 1500,
            quantity: 1,
            total: 1500,
          },
        ],
        total: 1500,
      };
      snapshots.push(structuredClone(state));
      state.description = "Website re-brand + logo";
      state.items.push({
        id: `demo-${id}-item-2`,
        name: "Logo Design",
        price: 300.9,
        quantity: 1,
        total: 300.9,
      });
      state.total = 1800.9;
      snapshots.push(structuredClone(state));
      state.items[0] = {
        ...state.items[0],
        id: `demo-${id}-item-1`,
        name: "Brand Guidelines",
        quantity: 1,
        price: 1800.9,
        total: 1800.9,
      };
      state.total = 2101.8;
      snapshots.push(structuredClone(state));
      state.status = "pending";
      snapshots.push(structuredClone(state));
      state.status = "paid";
    }
    snapshots.push(structuredClone(state));
    return { id, invoice: state, snapshots };
  });
}

/**
 * Replace only the dedicated demo workspace. Global invoice IDs owned by
 * someone else are a conflict, never permission to delete/transfer their data.
 * @param {import('@prisma/client').PrismaClient} prisma
 */
async function resetDemoWorkspace(prisma) {
  const records = canonicalDemoRecords();
  await prisma.$transaction(
    async (tx) => {
      // Serialize demo resets only. This does not isolate concurrent visitors'
      // ordinary edits: the shared workspace is an intentional Portfolio v1 limit.
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(8372401)`;
      const conflict = await tx.invoice.findFirst({
        where: {
          id: { in: records.map((record) => record.id) },
          createdById: { not: DEMO_ID },
        },
        select: { id: true },
      });
      if (conflict)
        throw new Error(
          "Canonical demo invoice ID is owned by another user; reset refused",
        );

      await tx.user.upsert({
        where: { id: DEMO_ID },
        create: DEMO_USER,
        update: { role: "USER" },
      });
      const oldInvoices = await tx.invoice.findMany({
        where: { createdById: DEMO_ID },
        select: { clientAddressId: true, senderAddressId: true },
      });
      await tx.invoice.deleteMany({ where: { createdById: DEMO_ID } });
      // Invoice deletion cascades items/history, but not its address rows.
      await tx.clientAddress.deleteMany({
        where: {
          id: {
            in: oldInvoices.flatMap((invoice) =>
              invoice.clientAddressId === null ? [] : [invoice.clientAddressId],
            ),
          },
          Invoice: { is: null },
        },
      });
      await tx.senderAddress.deleteMany({
        where: {
          id: {
            in: oldInvoices.flatMap((invoice) =>
              invoice.senderAddressId === null ? [] : [invoice.senderAddressId],
            ),
          },
          Invoice: { is: null },
        },
      });
      for (const { id, invoice, snapshots } of records) {
        const { items, clientAddress, senderAddress, ...fields } = invoice;
        await tx.invoice.create({
          data: {
            ...fields,
            id,
            createdBy: { connect: { id: DEMO_ID } },
            items: { create: items },
            clientAddress: { create: clientAddress },
            senderAddress: { create: senderAddress },
          },
        });
        await tx.invoiceRevision.createMany({
          data: snapshots.map((snapshot, index) => ({
            id: `demo-${id}-revision-${index + 1}`,
            invoiceId: id,
            revisionNumber: index + 1,
            createdById: DEMO_ID,
            changeType: index === 0 ? "create" : "edit",
            message:
              id === "RT3080"
                ? ([
                    "Initial draft created",
                    "Added logo design deliverable",
                    "Increased brand guidelines price",
                    "Sent to client, pending payment",
                    "Marked as paid",
                  ][index] ?? "Invoice created")
                : "Invoice created",
            createdAt: new Date(Date.UTC(2021, 7, 18, 12, index)),
            snapshot:
              /** @type {import('@prisma/client').Prisma.InputJsonObject} */ (
                /** @type {unknown} */ (snapshot)
              ),
          })),
        });
      }
    },
    { timeout: 15000 },
  );
}

module.exports = {
  DEMO_ID,
  DEMO_USER,
  canonicalDemoRecords,
  resetDemoWorkspace,
};
