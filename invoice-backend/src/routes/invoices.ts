// import express from "express";
// import {Invoice} from "../types";
// import invoiceService  from "../services/invoiceService";
// import {validateInvoiceData} from "../utils";
//
//
// const router = express.Router();
//
// // router.get("/api/invoices", (_req, res) => {
// //     const data: Invoice[] = invoiceService.getInvoices();
// //     res.json(data);
// // });
//
// router.get("/api/invoices/:id", (req, res) => {
//     const { id } = req.params;
//     console.log(id);
//     try {
//         const invoice = invoiceService.getInvoiceById(id) as Invoice;
//         console.log(invoice);
//         res.json(invoice);
//     } catch (error) {
//         console.log("error occurred");
//         res.json(error);
//     }
// });
//
// router.post("/api/invoices", (req, res) => {
//     const unvalidatedInvoice: unknown = req.body;
//     try {
//         const validatedInvoice = validateInvoiceData(unvalidatedInvoice);
//         invoiceService.addInvoice(unvalidatedInvoice as Invoice);
//         res.send(validatedInvoice);
//     } catch (error: any) {
//         console.log(error);
//         res.status(400).send(error.message);
//     }
// });
//
// router.put("/api/invoices/:id", (req, res) => {
//   const { id } = req.params;
//   const body = req.body as object;
//   try {
//       const invoice = invoiceService.updateInvoice(id, body);
//       // update invoice in invoiceService
//       res.json(invoice);
//   } catch (error) {
//       res.json(error);
//   }
// });
//
// router.delete("/api/invoices/:id", (req, res) => {
//   const { id } = req.params;
//   try {
//       const isDeleted = invoiceService.deleteInvoice(id);
//       if (isDeleted) {
//           res.sendStatus(200);
//       } else {
//           res.status(404).send("Could not find an invoice with that id");
//       }
//
//   } catch (error) {
//       console.log(error);
//       res.status(400).json(error);
//   }
//   });
//
// export default router;
