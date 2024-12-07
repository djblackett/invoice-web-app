/* eslint-disable @typescript-eslint/no-unused-expressions */
import jwt from "jsonwebtoken";
import { ContextArgs, QueryContext, UserDTO } from "../constants/types";
import container from "../config/inversify.config";
import { SECRET } from "../config/server.config";
import { UserService } from "../services/user.service";

const DEBUG = false;

export async function createContext({
  req,
  connection,
}: ContextArgs): Promise<QueryContext> {
  if (connection) {
    // This is a subscription request
    DEBUG && console.log(connection);
    return { connection };
  }

  // This is a regular request
  DEBUG && console.log("regular request");
  DEBUG && console.log("no connection");

  DEBUG && console.log("Regular request, checking authorization header...");
  const auth = req?.headers.authorization;
  // console.log("auth", auth);

  if (!auth) {
    DEBUG && console.log("No authorization header, returning early.");
    return {};
  }

  if (!auth.startsWith("Bearer ")) {
    DEBUG && console.log("Invalid authorization header, returning early.");
    return {};
  }

  if (!SECRET) {
    throw new Error("No secret set");
  }

  try {
    const authToken = auth.split(" ")[1];
    const decodedToken = jwt.verify(authToken, SECRET);

    if (typeof decodedToken === "string") {
      DEBUG && console.log(decodedToken);
      return {};
    }

    const userService = container.get(UserService);
    const user = await userService.getUser(decodedToken.id);
    if (user) {
       
      const userNoPassword: UserDTO = {
        id: user.id,
        name: user.name,
        username: user.username,
      };
      // return { user: userNoPassword };
      return {};
    }
    return {};
  } catch (error: any) {
    DEBUG && console.error("JWT verification failed", error);
    throw new Error(`JWT verification failed: ${error.message}`);
  }
}
console.log("After createContext");
