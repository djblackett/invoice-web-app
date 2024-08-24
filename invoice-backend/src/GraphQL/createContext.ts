import jwt from "jsonwebtoken";
import { ContextArgs } from "../constants/types";
import container from "../config/inversify.config";
import { SECRET } from "../config/server.config";
import { UserService } from "../services/user.service";

const DEBUG = false;

export async function createContext({ req, connection }: ContextArgs) {
  if (connection) {
    // This is a subscription request
    DEBUG && console.log(connection);
    return connection;
  }

  // This is a regular request
  DEBUG && console.log("regular request");
  DEBUG && console.log("no connection");

  DEBUG && console.log("Regular request, checking authorization header...");
  const auth = req?.headers.authorization;

  if (!auth) {
    DEBUG && console.log("No authorization header, returning early.");
    return;
  }

  if ( !auth.startsWith("Bearer ")) {
    DEBUG && console.log("Invalid authorization header, returning early.");
    return;
  }

  if (!SECRET) {
    throw new Error("No secret set");
  }

  try {
    const authToken = auth.split(" ")[1];
    const decodedToken = jwt.verify(authToken, SECRET);

    if (typeof decodedToken === "string") {
      DEBUG && console.log(decodedToken);
      return;
    }

    const userService = container.get(UserService);
    return await userService.getUser(decodedToken.id);
  } catch (error) {
    DEBUG && console.error("JWT verification failed", error);
  }
}
console.log("After createContext");
