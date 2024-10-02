import { inject, injectable } from "inversify";
import { IUserRepo } from "../userRepo";
import { DatabaseConnection } from "../../database/prisma.database.connection";
import { CreateUserArgs, ReturnedUser } from "../../constants/types";
import { Prisma, User } from "@prisma/client";

// todo - separate the logic and types for user creation before encryption and afterwards

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
    userArgs: CreateUserArgs,
    hashedPassword: string,
  ): Promise<ReturnedUser> {
    try {
      return this.prisma.user.create({
        data: {
          name: userArgs.name,
          username: userArgs.username,
          passwordHash: hashedPassword,
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
  loginUser = async (username: string, password: string) => {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  };
}
