import { GraphQLError } from "graphql";
import { UserService } from "../services/user.service";
import {
  CreateUserDTO,
  InjectedQueryContext,
  LoginArgs,
} from "../constants/types";
import {
  NotFoundException,
  UnauthorizedException,
} from "../config/exception.config";

export function getUserResolvers(userService: UserService) {
  return {
    Query: {
      allUsers: async () => {
        try {
          return await userService.getUsers();
        } catch (error) {
          console.error("Error caught in resolver", error);
          throw new GraphQLError("Internal server error", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      },

      getUserById: async (_root: unknown, args: { id: string }) => {
        try {
          const user = await userService.getUser(args.id);
          return user;
        } catch (error) {
          console.error(error);
          throw new GraphQLError("Internal server error", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      },
    },

    Mutation: {
      createUser: async (_root: unknown, args: CreateUserDTO) => {
        try {
          const user = await userService.createUser(args);
          return user;
        } catch (error: any) {
          console.error(error);
          if (error.name === "ValidationError") {
            throw new GraphQLError("Validation error", {
              extensions: {
                code: "BAD_USER_INPUT",
                error: error.message,
              },
            });
          } else {
            throw new GraphQLError("Internal server error", {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
              },
            });
          }
        }
      },

      deleteUsers: async (
        _root: never,
        _args: never,
        context: InjectedQueryContext,
      ) => {
        if (!context.user) {
          throw new UnauthorizedException();
        }
        if (context.user.role !== "admin") {
          throw new UnauthorizedException("Only admin can delete all users");
        }
        try {
          const result = await userService.deleteUsers();
          if (result) {
            return { acknowledged: true };
          }
          return { acknowledged: false };
        } catch (error) {
          console.error(error);
          throw new GraphQLError("Internal server error", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      },

      deleteUsersKeepAdmins: async (
        _root: never,
        _args: never,
        context: InjectedQueryContext,
      ) => {
        if (!context.user) {
          throw new UnauthorizedException();
        }
        if (context.user.role !== "admin") {
          throw new UnauthorizedException("Only admin can delete all users");
        }
        try {
          const result = await userService.deleteUsersKeepAdmin();
          if (result) {
            return { acknowledged: true };
          }
          return { acknowledged: false };
        } catch (error) {
          console.error(error);
          throw new GraphQLError("Internal server error", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          });
        }
      },
    },
  };
}
