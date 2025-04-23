import { GraphQLError } from "graphql";
import type { UserService } from "../services/user.service";
import type { CreateUserDTO, InjectedQueryContext } from "../constants/types";
import { UnauthorizedException } from "../config/exception.config";

export function getUserResolvers() {
  return {
    Query: {
      allUsers: async (
        _root: unknown,
        _args: unknown,
        context: InjectedQueryContext,
      ) => {
        try {
          const userService = validateUserService(context.userService);

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

      getUserById: async (
        _root: unknown,
        args: { id: string },
        context: InjectedQueryContext,
      ) => {
        try {
          const userService = validateUserService(context.userService);

          const user = await userService.getUserByIdSafely(args.id);
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
      createUser: async (
        _root: unknown,
        args: CreateUserDTO,
        context: InjectedQueryContext,
      ) => {
        try {
          const userService = validateUserService(context.userService);
          const user = await userService.createUser(args);
          return user;
        } catch (error: unknown) {
          if (error instanceof Error && error.name === "ValidationError") {
            console.error(error);

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
        _root: unknown,
        _args: unknown,
        context: InjectedQueryContext,
      ) => {
        if (!context.user) {
          throw new UnauthorizedException("User not authenticated");
        }
        if (context.user.role !== "ADMIN") {
          throw new UnauthorizedException("Only admin can delete all users");
        }
        try {
          const userService = validateUserService(context.userService);
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
        _root: unknown,
        _args: unknown,
        context: InjectedQueryContext,
      ) => {
        if (!context.user) {
          throw new UnauthorizedException("User not authenticated");
        }
        if (context.user.role !== "ADMIN") {
          throw new UnauthorizedException("Only admin can delete all users");
        }
        try {
          const userService = validateUserService(context.userService);

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

function validateUserService(userService: UserService | undefined) {
  if (!userService) {
    console.error("User service not found in context");
    throw new GraphQLError("Internal server error", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
  return userService;
}
