import { GraphQLError } from "graphql";
import { UserService } from "../services/user.service";
import { SECRET } from "../config/server.config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  CreateUserArgsUnhashedPassword,
  ReturnedUser,
  LoginArgs,
} from "../constants/types";

export function getUserResolvers(userService: UserService) {
  return {
    Query: {
      allUsers: async () => {
        try {
          return userService.getUsers();
        } catch (error) {
          throw new GraphQLError("Couldn't fetch users", {
            extensions: {
              error: error,
            },
          });
        }
      },
    },
    Mutation: {
      createUser: async (
        _root: unknown,
        args: CreateUserArgsUnhashedPassword,
      ) => {
        const user = await userService.createUser(args);
        const userNoPassword: ReturnedUser = {
          id: user.id,
          name: user.name,
          username: user.username,
        };
        return userNoPassword;
      },

      login: async (_root: unknown, args: LoginArgs) => {
        const user = await userService.login(args.username, args.password);

        if (!user) {
          throw new GraphQLError("User does not exist", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });
        }

        console.log(user);

        if (!SECRET) {
          console.log("Server env secret not set");
          return;
        }

        console.log("before match");
        // todo - adjust code and types so that returned user has passwordhash, but it doesn't get sent outside of service
        const match = await bcrypt.compare(args.password, user.passwordHash);

        console.log("match:", match);
        if (match) {
          // let jwt;
          return {
            value: jwt.sign(JSON.stringify(user), SECRET),
          };
        } else {
          throw new GraphQLError("wrong credentials", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });
        }
      },
    },
  };
}
