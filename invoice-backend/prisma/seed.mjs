import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasourceUrl:
    process.env.DATABASE_URL ||
    "postgresql://postgres:example@localhost:5432/db-demo?schema=public",
});

async function create(invoice) {
  try {
    const result = await prisma.invoice.create({
      data: {
        createdBy: {
          connect: { id: invoice.createdById },
        },
        id: invoice.id || "",
        clientEmail: invoice.clientEmail || "",
        clientName: invoice.clientName || "",
        createdAt: invoice.createdAt || new Date().toISOString(),
        description: invoice.description || "",
        paymentDue:
          invoice.paymentDue ||
          new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        paymentTerms: invoice.paymentTerms || 14,
        status: invoice.status || "pending",
        total: invoice.total || new Prisma.Decimal(0),
        items: {
          create:
            invoice.items?.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
            })) || [],
        },
        ...(invoice.clientAddress && {
          clientAddress: {
            create: {
              city: invoice.clientAddress.city,
              country: invoice.clientAddress.country,
              postCode: invoice.clientAddress.postCode,
              street: invoice.clientAddress.street,
            },
          },
        }),
        ...(invoice.senderAddress && {
          senderAddress: {
            create: {
              city: invoice.senderAddress.city,
              country: invoice.senderAddress.country,
              postCode: invoice.senderAddress.postCode,
              street: invoice.senderAddress.street,
            },
          },
        }),
      },
      include: {
        items: true,
        clientAddress: true,
        senderAddress: true,
        createdBy: true,
      },
    });

    // Convert total from Decimal to number
    const createdInvoice = {
      ...result,
      total: Number(result.total),
    };

    return createdInvoice;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
}

const createUserWithAuth0 = async (args) => {
  try {
    return prisma.user
      .create({
        select: {
          id: true,
          role: true,
          username: true,
          name: true,
        },
        data: {
          id: args.id,
          role: args.role,
          username: args.username ?? "",
          name: args.name ?? "",
        },
      })
      .then((user) => ({
        ...user,
        name: user.name ?? "",
      }));
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      console.error(e);
      throw new Error("Unique constraint failed on the fields: (`username`)");
    }
    console.error(e);
    throw e;
  }
};

async function getUserByIdSafely(id) {
  try {
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
      },
      where: {
        id,
      },
    });
    return user ? { ...user, name: user.name ?? "" } : null;
  } catch (e) {
    console.error(e);
    // throw new Error("Failed to fetch user");
    return null;
  }
}

const user = {
  id: "user1",
  name: "John Doe",
  username: "john@melba.toast",
  role: "USER",
};

const data = [
  {
    id: "RT3080",
    createdBy: {
      id: "user1",
      name: "John Doe",
      username: "john@melba.toast",
      role: "USER",
    },
    createdById: "user1",
    createdAt: "2021-08-18",
    paymentDue: "2021-08-19",
    description: "Re-branding",
    paymentTerms: 1,
    clientName: "Jensen Huang",
    clientEmail: "jensenh@mail.com",
    status: "paid",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "106 Kendell Street",
      city: "Sharrington",
      postCode: "NR24 5WQ",
      country: "United Kingdom",
    },
    items: [
      {
        name: "Brand Guidelines",
        quantity: 1,
        price: 1800.9,
        total: 1800.9,
      },
    ],
    total: 1800.9,
  },
  {
    id: "XM9141",

    createdBy: {
      id: "user1",
      name: "John Doe",
      username: "john@melba.toast",
      role: "USER",
    },
    createdById: "user1",
    createdAt: "2021-08-21",
    paymentDue: "2021-09-20",
    description: "Graphic Design",
    paymentTerms: 30,
    clientName: "Alex Grim",
    clientEmail: "alexgrim@mail.com",
    status: "pending",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "84 Church Way",
      city: "Bradford",
      postCode: "BD1 9PB",
      country: "United Kingdom",
    },
    items: [
      {
        name: "Banner Design",
        quantity: 1,
        price: 156.0,
        total: 156.0,
      },
      {
        name: "Email Design",
        quantity: 2,
        price: 200.0,
        total: 400.0,
      },
    ],
    total: 556.0,
  },
  {
    id: "RG0314",
    createdBy: {
      id: "user1",
      name: "John Doe",
      username: "john@melba.toast",
      role: "USER",
    },
    createdById: "user1",
    createdAt: "2021-09-24",
    paymentDue: "2021-10-01",
    description: "Website Redesign",
    paymentTerms: 7,
    clientName: "John Morrison",
    clientEmail: "jm@myco.com",
    status: "paid",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "79 Dover Road",
      city: "Westhall",
      postCode: "IP19 3PF",
      country: "United Kingdom",
    },
    items: [
      {
        name: "Website Redesign",
        quantity: 1,
        price: 14002.33,
        total: 14002.33,
      },
    ],
    total: 14002.33,
  },
  {
    id: "RT2080",
    createdBy: {
      id: "user1",
      name: "John Doe",
      username: "john@melba.toast",
      role: "USER",
    },
    createdById: "user1",
    createdAt: "2021-10-11",
    paymentDue: "2021-10-12",
    description: "Logo Concept",
    paymentTerms: 1,
    clientName: "Alysa Werner",
    clientEmail: "alysa@email.co.uk",
    status: "pending",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "63 Warwick Road",
      city: "Carlisle",
      postCode: "CA20 2TG",
      country: "United Kingdom",
    },
    items: [
      {
        name: "Logo Sketches",
        quantity: 1,
        price: 102.04,
        total: 102.04,
      },
    ],
    total: 102.04,
  },
  {
    id: "AA1449",
    createdBy: {
      id: "user1",
      name: "John Doe",
      username: "john@melba.toast",
      role: "USER",
    },
    createdById: "user1",
    createdAt: "2021-10-7",
    paymentDue: "2021-10-14",
    description: "Re-branding",
    paymentTerms: 7,
    clientName: "Mellisa Clarke",
    clientEmail: "mellisa.clarke@example.com",
    status: "pending",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "46 Abbey Row",
      city: "Cambridge",
      postCode: "CB5 6EG",
      country: "United Kingdom",
    },
    items: [
      {
        name: "New Logo",
        quantity: 1,
        price: 1532.33,
        total: 1532.33,
      },
      {
        name: "Brand Guidelines",
        quantity: 1,
        price: 2500.0,
        total: 2500.0,
      },
    ],
    total: 4032.33,
  },
  {
    id: "TY9141",
    createdBy: {
      id: "user1",
      name: "John Doe",
      username: "john@melba.toast",
      role: "USER",
    },
    createdById: "user1",
    createdAt: "2021-10-01",
    paymentDue: "2021-10-31",
    description: "Landing Page Design",
    paymentTerms: 30,
    clientName: "Thomas Wayne",
    clientEmail: "thomas@dc.com",
    status: "pending",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "3964  Queens Lane",
      city: "Gotham",
      postCode: "60457",
      country: "United States of America",
    },
    items: [
      {
        name: "Web Design",
        quantity: 1,
        price: 6155.91,
        total: 6155.91,
      },
    ],
    total: 6155.91,
  },
  {
    id: "FV2353",
    createdBy: {
      id: "user1",
      name: "John Doe",
      username: "john@melba.toast",
      role: "USER",
    },
    createdById: "user1",
    createdAt: "2021-11-05",
    paymentDue: "2021-11-12",
    description: "Logo Re-design",
    paymentTerms: 7,
    clientName: "Anita Wainwright",
    clientEmail: "",
    status: "draft",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    items: [
      {
        name: "Logo Re-design",
        quantity: 1,
        price: 3102.04,
        total: 3102.04,
      },
    ],
    total: 3102.04,
  },
];

/**
 * Build a snapshot object matching the shape expected by the backend
 * revision diff engine (see `services/invoiceDiff.ts#InvoiceSnapshot`).
 * Keeping this logic in the seed instead of importing from /src lets the
 * seed stay runnable under Node without ts-node.
 */
function buildSnapshot(invoice) {
  const items = (invoice.items ?? []).map((it) => ({
    id: it.id ?? "",
    name: it.name ?? "",
    price: Number(it.price ?? 0),
    quantity: Number(it.quantity ?? 0),
    total: Number(it.total ?? 0),
  }));
  const total = items.reduce((s, i) => s + i.total, 0);
  return {
    clientAddress: { ...(invoice.clientAddress ?? {}) },
    senderAddress: { ...(invoice.senderAddress ?? {}) },
    clientEmail: invoice.clientEmail ?? "",
    clientName: invoice.clientName ?? "",
    createdAt: invoice.createdAt ?? "",
    description: invoice.description ?? "",
    items,
    paymentDue: invoice.paymentDue ?? "",
    paymentTerms: Number(invoice.paymentTerms ?? 0),
    status: invoice.status ?? "",
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Demo revisions for the first seeded invoice so a reviewer can open
 * it and immediately exercise the history UI without doing edits first.
 * Stored in reverse-chronological order (most recent first), but they'll
 * be inserted with ascending revisionNumber below.
 */
const demoRevisionEdits = [
  {
    message: "Initial draft created",
    changeType: "create",
    mutate: (state) => ({
      ...state,
      status: "draft",
      description: "Website re-brand (draft)",
      items: [
        { id: "seed-item-1", name: "Brand Guidelines", quantity: 1, price: 1500, total: 1500 },
      ],
    }),
  },
  {
    message: "Added logo design deliverable",
    changeType: "edit",
    mutate: (state) => ({
      ...state,
      description: "Website re-brand + logo",
      items: [
        ...state.items,
        { id: "seed-item-2", name: "Logo Design", quantity: 1, price: 300.9, total: 300.9 },
      ],
    }),
  },
  {
    message: "Increased brand guidelines price",
    changeType: "edit",
    mutate: (state) => ({
      ...state,
      items: state.items.map((it) =>
        it.id === "seed-item-1" ? { ...it, price: 1800.9, total: 1800.9 } : it,
      ),
    }),
  },
  {
    message: "Sent to client, pending payment",
    changeType: "edit",
    mutate: (state) => ({ ...state, status: "pending" }),
  },
  {
    message: "Marked as paid",
    changeType: "edit",
    mutate: (state) => ({ ...state, status: "paid" }),
  },
];

async function seedRevisionsForInvoice(invoice) {
  // Build successive snapshots by applying each demo edit in order.
  let state = buildSnapshot({ ...invoice, items: [] });
  let revisionNumber = 0;
  for (const step of demoRevisionEdits) {
    state = step.mutate(state);
    // Recompute totals so every snapshot is internally consistent.
    const items = state.items.map((it) => ({
      ...it,
      total: Math.round(it.price * it.quantity * 100) / 100,
    }));
    const total = Math.round(items.reduce((s, i) => s + i.total, 0) * 100) / 100;
    const snapshot = { ...state, items, total };
    revisionNumber += 1;
    await prisma.invoiceRevision.create({
      data: {
        invoiceId: invoice.id,
        revisionNumber,
        changeType: step.changeType,
        message: step.message,
        createdById: invoice.createdById,
        snapshot,
      },
    });
    state = snapshot;
  }

  // Fast-forward the actual invoice to match the final demo revision so
  // that the "current" invoice and the newest revision agree.
  const finalSnapshot = state;
  await prisma.$transaction(async (tx) => {
    await tx.item.deleteMany({ where: { invoiceId: invoice.id } });
    for (const item of finalSnapshot.items) {
      await tx.item.create({
        data: {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.total,
          Invoice: { connect: { id: invoice.id } },
        },
      });
    }
    await tx.invoice.update({
      where: { id: invoice.id },
      data: {
        status: finalSnapshot.status,
        description: finalSnapshot.description,
        total: finalSnapshot.total,
      },
    });
  });
}

async function main() {
  await prisma.$connect();

  let dbUser = await getUserByIdSafely(user.id);

  if (!dbUser) {
    dbUser = await createUserWithAuth0(user);
  }
  for (const invoice of data) {
    const existing = await prisma.invoice.findUnique({ where: { id: invoice.id } });
    if (existing) {
      console.log(`Invoice ${invoice.id} already exists — skipping.`);
      continue;
    }
    const created = await create(invoice);

    // For every seeded invoice, record a single "create" revision so the
    // history view is never empty. The first invoice additionally gets a
    // full demo history so a reviewer can click through restore/diff.
    const initialSnapshot = buildSnapshot(created);
    await prisma.invoiceRevision.create({
      data: {
        invoiceId: created.id,
        revisionNumber: 1,
        changeType: "create",
        message: "Invoice created",
        createdById: created.createdById,
        snapshot: initialSnapshot,
      },
    });
  }

  // Replace the history for the first demo invoice with a richer series.
  const demoInvoiceId = data[0]?.id;
  if (demoInvoiceId) {
    await prisma.invoiceRevision.deleteMany({ where: { invoiceId: demoInvoiceId } });
    await seedRevisionsForInvoice(data[0]);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
