import jwt from "jsonwebtoken";
import { ContextArgs } from "../constants/types";
import container from "../config/inversify.config";
import { InvoiceService } from "../services/invoice.service";
import { SECRET } from "../config/server.config";

export async function createContext({ req, connection }: ContextArgs) {
  // console.log("-----------------connection");
  if (connection) {
    // This is a subscription request
    console.log(connection);
    return connection;
  }

  // This is a regular request
  console.log("regular request");
  console.log("no connection");

  console.log("Regular request, checking authorization header...");
  const auth = req?.headers.authorization;

  if (!auth) {
    console.log("No authorization header, returning early.");
    return;
  }

  if ( !auth.startsWith("Bearer ")) {
    console.log("Invalid authorization header, returning early.");
    return;
  }

  if (!SECRET) {
    throw new Error("No secret set");
  }

  try {
    const authToken = auth.split(" ")[1];
    const decodedToken = jwt.verify(authToken, SECRET);

    if (typeof decodedToken === "string") {
      console.log(decodedToken);
      return;
    }

    const invoiceService = container.get(InvoiceService);
    return await invoiceService.getUser(decodedToken.id);
  } catch (error) {
    console.error("JWT verification failed", error);
  }
}
console.log("After createContext");

