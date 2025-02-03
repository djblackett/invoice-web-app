import { GraphQLError } from "graphql";
import { UserService } from "../services/user.service";
import { CreateUserDTO, LoginArgs } from "../constants/types";
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
      deleteUsers: async () => {
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

      // login: async (_root: unknown, args: LoginArgs, { user }: any) => {
      //   try {
      //     const username = await user;
      //     const loginResponse = await userService.login(
      //       args.username,
      //       args.password,
      //     );
      //     return loginResponse;
      //   } catch (error) {
      //     console.error(error);
      //     if (error instanceof NotFoundException) {
      //       throw new GraphQLError("User not found", {
      //         extensions: {
      //           code: "BAD_USER_INPUT",
      //         },
      //       });
      //     } else if (error instanceof UnauthorizedException) {
      //       throw new GraphQLError("Invalid username or password", {
      //         extensions: {
      //           code: "UNAUTHENTICATED",
      //         },
      //       });
      //     } else {
      //       throw new GraphQLError("Internal server error", {
      //         extensions: {
      //           code: "INTERNAL_SERVER_ERROR",
      //         },
      //       });
      //     }
      //   }
      // },
    },
  };
}
