import { GraphQLError } from "graphql";
import { UserService } from "../services/user.service";
import { CreateUserDTO, InjectedQueryContext } from "../constants/types";
import { UnauthorizedException } from "../config/exception.config";

export function getUserResolvers(userServiceMock: unknown) {
  return {
    Query: {
      allUsers: async (
        _root: null = null,
        _parent: null = null,
        context: InjectedQueryContext,
      ) => {
        try {
          // console.error("User resolver:", context);
          // const userService = validateUserService(context.userService);
          const { userService } = context;

          if (!userService) {
            console.error("User service not found in context");
            throw new GraphQLError("Internal server error", {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
              },
            });
          }
          // console.log("userService:", userService);
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

          if (!userService) {
            console.error("User service not found in context");
            throw new GraphQLError("Internal server error", {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
              },
            });
          }
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
          // console.log("Create user resolver: context:", context);
          // const userService = validateUserService(context.userService);
          const { userService } = context;

          if (!userService) {
            console.error("User service not found in context");
            throw new GraphQLError("Internal server error", {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
              },
            });
          }
          // console.error("userService:", userService);
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
        _root: null = null,
        _args: null = null,
        context: InjectedQueryContext,
      ) => {
        if (!context.user) {
          throw new UnauthorizedException("User not authenticated");
        }
        if (context.user.role !== "ADMIN") {
          throw new UnauthorizedException("Only admin can delete all users");
        }
        try {
          // const userService = validateUserService(context.userService);
          const { userService } = context;

          if (!userService) {
            console.error("User service not found in context");
            throw new GraphQLError("Internal server error", {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
              },
            });
          }
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
        _root: null = null,
        _args: null = null,
        context: InjectedQueryContext,
      ) => {
        if (!context.user) {
          throw new UnauthorizedException("User not authenticated");
        }
        if (context.user.role !== "ADMIN") {
          throw new UnauthorizedException("Only admin can delete all users");
        }
        try {
          // const userService = validateUserService(context.userService);
          const { userService } = context;

          if (!userService) {
            console.error("User service not found in context");
            throw new GraphQLError("Internal server error", {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
              },
            });
          }
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
      // extensions: {
      //   code: "INTERNAL_SERVER_ERROR",
      // },
    });
  }
  return userService;
}
