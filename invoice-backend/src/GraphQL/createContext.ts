// import jwt from "jsonwebtoken";
import {ContextArgs} from "../types";
import {prisma} from "../../index";
// const User = require("../Models/User");



// eslint-disable-next-line @typescript-eslint/require-await
export async function createContext({ req, connection }: ContextArgs) {
  console.log("-----------------connection");
  if (connection) {
    // This is a subscription request
    // console.log("Subscription context: ", connection.context);
    console.log(connection);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    // return connection.context;
    return connection;
  } else {
    // This is a regular request
    console.log("regular request");
    console.log("no connection");

    const auth: string | undefined | null = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      // const decodedToken = jwt.verify(
      //   auth.substring(7),
      //   process.env.JWT_SECRET
      // );
      // const currentUser = await User.findById(decodedToken.id);
      const currentUser = {};

    }

  }
  return { prisma };
}

console.log("After createContext");

// module.exports = { createContext };
