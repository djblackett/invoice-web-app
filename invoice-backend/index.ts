
import express from "express";
import { PrismaClient } from "@prisma/client";
import invoicesRouter from "./src/routes/invoices";
import cors from "cors";
import myErrorHandler from "./src/routes/helpers/helpers";

process.env.NODE_ENV = "production";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 8000;

const prisma = new PrismaClient();

async function main() {
  await prisma.invoice.create({
    data: {
      id: "RT3080",
      createdAt: "2021-08-18",
      paymentDue: "2021-08-19",
      description: "Re-branding",
      paymentTerms: 1,
      clientName: "Jensen Huang",
      clientEmail: "jensenh@mail.com",
      status: "paid",
      senderAddress: {
        create: {
        street: "19 Union Terrace",
        city: "London",
        postCode: "E1 3EZ",
        country: "United Kingdom"
      },},
      clientAddress: {
        create: {
          street: "106 Kendell Street",
          city: "Sharrington",
          postCode: "NR24 5WQ",
          country: "United Kingdom"
        }
      },
      items: {
        create: [{
              id: "gbfhdsqg4783743bvh",
              name: "Brand Guidelines",
              quantity: 1,
              price: 1800.90,
              total: 1800.90
        }],
      },
      total: 1800.90
    },
  });

  const allInvoices = await prisma.invoice.findMany({
    include: {
      senderAddress: true,
      clientAddress: true,
      items: true
    }
  });
  console.log(allInvoices);
  console.log(allInvoices[0].items);
}


main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });

// if (process.env.NODE_ENV === 'development') {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//   app.use(express.errorHandler({ dumpExceptions: true, showStack: true }) as ErrorRequestHandler);
// }
//
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.errorHandler());
// }
// app.use(myErrorHandler);

app.use(invoicesRouter, myErrorHandler);
// app.use(patientRouter);




app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

