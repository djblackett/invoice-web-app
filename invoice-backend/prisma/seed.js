import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasourceUrl: "postgresql://postgres:example@localhost:5432/db-demo",
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
    // return prismaErrorHandler(error);
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
    // if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
    //   throw new Error("Unique constraint failed on the fields: (`username`)");
    // }
    console.error(e);
    throw e;
  }
};

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

async function main() {
  await prisma.$connect();
  await createUserWithAuth0(user);
  const promises = data.map((invoice) => create(invoice));
  await Promise.all(promises);
  await prisma.$disconnect();

  prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
