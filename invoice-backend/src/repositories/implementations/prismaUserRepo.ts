import { inject, injectable } from "inversify";
import { IUserRepo } from "../userRepo";
import { DatabaseConnection } from "../../database/prisma.database.connection";
import {
  CreateUserArgsHashedPassword,
  LoggedInUser,
  ReturnedUser,
} from "../../constants/types";
import { Prisma, User } from "@prisma/client";

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
      throw new Error("Failed to fetch users");
    }
  }

  async findUserById(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          id,
        },
      });
      return user;
    } catch (e: any) {
      console.error(e);
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        throw new Error("User not found");
      }

      throw new Error("Failed to fetch user");
    }
  }

  async createUser(
    userArgs: CreateUserArgsHashedPassword,
  ): Promise<ReturnedUser> {
    try {
      return this.prisma.user.create({
        data: {
          name: userArgs.name,
          username: userArgs.username,
          passwordHash: userArgs.hashedPassword,
        },
      });
    } catch (e: any) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        throw new Error("Unique constraint failed on the fields: (`username`)");
      }
      throw new Error("Database error");
    }
  }

  // Move login logic to its own files
  // todo distinguish between logging in for first time, and fetching correct user from auth header
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loginUser = async (
    username: string,
    passwordHash: string,
  ): Promise<LoggedInUser | null> => {
    try {
      const result = (await this.prisma.user.findUnique({
        where: {
          username,
          passwordHash,
        },
      })) as ReturnedUser;

      return {
        id: result.id,
        username: result.username,
      };
    } catch (e: any) {
      console.error(e);
      return null;
    }
  };
}
