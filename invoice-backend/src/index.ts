
import express from "express";
import invoicesRouter from "./routes/invoices";
import cors from "cors";
import myErrorHandler from "./routes/helpers/helpers";

process.env.NODE_ENV = "production";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

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

