import { GraphQLError } from "graphql";
import type { UserService } from "../services/user.service";
import type {
  CreateUserDTO,
  InjectedQueryContext,
  UserIdAndRole,
} from "../constants/types";
import { UnauthorizedException } from "../config/exception.config";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

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

      login: (
        _root: unknown,
        args: { username: string; password: string; provider?: string },
      ) => {
        try {
          // Handle different authentication providers
          if (args.provider === "google") {
            // For Google OAuth, the authentication is handled by Passport
            // This resolver would typically be called after successful OAuth
            throw new GraphQLError(
              "Google authentication should use OAuth flow",
              {
                extensions: {
                  code: "BAD_USER_INPUT",
                  message:
                    "Use /auth/google endpoint for Google authentication",
                },
              },
            );
          }

          // Default Auth0/JWT authentication
          // For now, this is a placeholder - in a real implementation,
          // you would validate credentials against your user database
          // or integrate with Auth0's authentication API

          // Mock implementation for demonstration
          if (
            args.username === "demo@example.com" &&
            args.password === "demo"
          ) {
            const user: UserIdAndRole = {
              id: "demo-user-id",
              username: args.username,
              name: "Demo User",
              role: Role.USER,
            };

            // Generate a JWT token
            const token = jwt.sign(
              {
                sub: user.id,
                email: user.username,
                name: user.name,
                role: user.role,
              },
              process.env["JWT_SECRET"] || "fallback-secret",
              { expiresIn: "24h" },
            );

            return {
              user: {
                id: user.id,
                username: user.username,
              },
              token,
            };
          }

          throw new GraphQLError("Invalid credentials", {
            extensions: {
              code: "UNAUTHENTICATED",
            },
          });
        } catch (error) {
          if (error instanceof GraphQLError) {
            throw error;
          }
          console.error("Login error:", error);
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
