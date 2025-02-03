import { inject, injectable } from "inversify";
import { IUserRepo } from "../userRepo";
import { DatabaseConnection } from "../../database/prisma.database.connection";
import {
  UserEntity,
  ReturnedUser,
  UserDTO,
  UserIdAndRole,
  User,
} from "../../constants/types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@injectable()
export class PrismaUserRepo implements IUserRepo {
  protected prisma;

  constructor(
    @inject(DatabaseConnection)
    private readonly databaseConnection: DatabaseConnection,
  ) {
    this.prisma = databaseConnection.getDatabase();
  }

  async deleteAllUsers(): Promise<boolean> {
    try {
      const result = await this.prisma.user.deleteMany();
      if (result) {
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      console.error(error);
      throw new Error("Database error");
    }
  }

  async findAllUsers(): Promise<ReturnedUser[]> {
    try {
      const users = await this.prisma.user.findMany();
      return users.map((user) => ({
        ...user,
        name: user.name ?? undefined,
      }));
    } catch (error: any) {
      console.error(error);
      throw new Error("Database error");
    }
  }

  async findUserById(id: string): Promise<UserDTO | null> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        select: {
          id: true,
          name: true,
          username: true,
        },
        where: {
          id,
        },
      });
      return { ...user, name: user.name ?? "" };
    } catch (e: any) {
      console.error(e);
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new Error("User not found");
      }

      throw new Error("Failed to fetch user");
    }
  }

  async getUserSafely(id: string): Promise<UserIdAndRole | null> {
    try {
      const user = await this.prisma.user.findUnique({
        select: {
          id: true,
          name: true,
          username: true,
          role: true,
        },
        where: {
          id,
        },
      });
      return user ? { ...user, name: user.name ?? "" } : null;
    } catch (e: any) {
      console.error(e);
      throw new Error("Failed to fetch user");
    }
  }

  async createUser(userArgs: UserEntity): Promise<UserIdAndRole> {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: userArgs.name ?? "",
          username: userArgs.username,
          passwordHash: userArgs.passwordHash,
          role: "USER",
        },
      });
      return { ...user, name: user.name ?? "" };
    } catch (e: any) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
        throw new Error("Unique constraint failed on the fields: (`username`)");
      }
      throw new Error("Database error");
    }
  }

  createUserWithAuth0 = async (args: UserIdAndRole): Promise<UserIdAndRole> => {
    try {
      return this.prisma.user
        .create({
          select: {
            id: true,
            role: true,
            username: true,
            name: true,
          },
          data: {
            id: args.id,
            role: args.role,
            username: args.username ?? "",
            name: args.name ?? "",
          },
        })
        .then((user) => ({
          ...user,
          name: user.name ?? "",
        }));
    } catch (e: any) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
        throw new Error("Unique constraint failed on the fields: (`username`)");
      }
      throw new Error("Database error");
    }
  };

  findUserByUsername = async (
    username: string,
  ): Promise<UserIdAndRole | null> => {
    try {
      const result = await this.prisma.user.findUniqueOrThrow({
        select: {
          id: true,
          name: true,
          username: true,
          role: true,
          // passwordHash: true,
        },
        where: {
          username,
          // passwordHash: {
          //   not: null,
          // },
        },
      });

      return {
        ...result,
        // passwordHash: result.passwordHash!,
        name: result.name ?? "",
      };
    } catch (e: any) {
      console.error(e);

      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new Error("Incorrect username or password");
      }
      throw new Error("Database error");
    }
  };
}
