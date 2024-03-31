import { inject, injectable } from "inversify";
import { IUserRepo } from "../userRepo";
import { DatabaseConnection } from "../../database/database.connection";
import { CreateUserArgs } from "../../constants/types";
import { GraphQLError } from "graphql/error";


@injectable()
export class PrismaUserRepo implements IUserRepo {
  protected prisma;

  constructor(
    @inject(DatabaseConnection)
    private readonly databaseConnection: DatabaseConnection,
  ) {
    this.prisma = databaseConnection.getDatabase();
  }

  async findAllUsers() {
    try {
      return await this.prisma.user.findMany();
    } catch (error: any) {
      console.error(error);
      return error;
    }
  }

  async findUserById(id: number) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
    } catch (error: any) {
      console.error(error);
      return error;
    }
  }

  async createUser(userArgs: CreateUserArgs, hashedPassword: string) {
    return this.prisma.user
      .create({
        data: {
          name: userArgs.name,
          username: userArgs.username,
          passwordHash: hashedPassword,
        },
      })
      .catch((error: unknown) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: userArgs.username,
            error,
          },
        });
      });
  }

  // Move login logic to its own repo

  // distinguish between logging in for first time, and fetching correct user from auth header
  loginUser = async (username: string, password: string) => {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  };

}