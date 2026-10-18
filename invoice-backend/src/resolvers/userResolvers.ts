import { GraphQLError } from "graphql";
import type { CreateUserDTO, InjectedQueryContext } from "../constants/types";
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "../config/exception.config";

export function getUserResolvers() {
  return {
    Query: {
      allUsers: async (
        _root: unknown,
        _args: unknown,
        context: InjectedQueryContext,
      ) => {
        try {
          return await validateUserService(context).getUsers();
        } catch (error) {
          throwUserError(error);
        }
      },
      getUserById: async (
        _root: unknown,
        args: { id: string },
        context: InjectedQueryContext,
      ) => {
        try {
          const user = await validateUserService(context).getUserByIdSafely(
            args.id,
          );
          if (!user) throw new NotFoundException("User not found");
          return user;
        } catch (error) {
          throwUserError(error);
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
          return await validateUserService(context).createUser(args);
        } catch (error) {
          if (error instanceof Error && error.name === "ValidationError")
            throw new GraphQLError("Validation error", {
              extensions: { code: "BAD_USER_INPUT", error: error.message },
            });
          throwUserError(error);
        }
      },
      deleteUsers: async (
        _root: unknown,
        _args: unknown,
        context: InjectedQueryContext,
      ) => {
        try {
          return {
            acknowledged: await validateUserService(context).deleteUsers(),
          };
        } catch (error) {
          throwUserError(error);
        }
      },
      deleteUsersKeepAdmins: async (
        _root: unknown,
        _args: unknown,
        context: InjectedQueryContext,
      ) => {
        try {
          return {
            acknowledged:
              await validateUserService(context).deleteUsersKeepAdmin(),
          };
        } catch (error) {
          throwUserError(error);
        }
      },
    },
  };
}

function validateUserService(context: InjectedQueryContext) {
  if (!context.user?.id || !context.user.role)
    throw new UnauthorizedException("User not authenticated");
  if (!context.userService)
    throw new Error("User service not found in context");
  return context.userService;
}

function throwUserError(error: unknown): never {
  if (error instanceof UnauthorizedException)
    throw new GraphQLError(error.message, {
      extensions: { code: "UNAUTHORIZED" },
    });
  if (error instanceof ForbiddenException)
    throw new GraphQLError(error.message, {
      extensions: { code: "FORBIDDEN" },
    });
  if (error instanceof NotFoundException)
    throw new GraphQLError(error.message, {
      extensions: { code: "NOT_FOUND" },
    });
  console.error("Error caught in user resolver", error);
  throw new GraphQLError("Internal server error", {
    extensions: { code: "INTERNAL_SERVER_ERROR" },
  });
}
