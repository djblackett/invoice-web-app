import { inject, injectable } from "inversify";
import type { IUserRepo } from "../userRepo";
import { IDatabaseConnection } from "../../database/database.connection";
import TYPES from "../../constants/identifiers";
import type {
  ReturnedUser,
  UserDTO,
  UserEntity,
  UserIdAndRole,
} from "../../constants/types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@injectable()
export class PrismaUserRepository implements IUserRepo {
  protected prisma;

  constructor(
    @inject(TYPES.DatabaseConnection)
    databaseConnection: IDatabaseConnection,
  ) {
    this.prisma = databaseConnection.getDatabase();
  }

  async deleteAllUsers(): Promise<boolean> {
    try {
      const result = await this.prisma.user.deleteMany();
      if (result.count > 0) {
        return true;
      } else {
        return false;
      }
    } catch (e: unknown) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      throw new Error(`Database error: ${errorMessage}`);
    }
  }

  async deleteAllUsersKeepAdmin(): Promise<boolean> {
    try {
      const result = await this.prisma.user.deleteMany({
        where: {
          role: {
            not: "ADMIN",
          },
        },
      });
      if (result.count > 0) {
        return true;
      } else {
        return false;
      }
    } catch (e: unknown) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      throw new Error(`Database error: ${errorMessage}`);
    }
  }

  async getAllUsers(): Promise<ReturnedUser[]> {
    try {
      const users = await this.prisma.user.findMany();
      return users.map((user) => ({
        ...user,
        name: user.name ?? "",
      }));
    } catch (error: unknown) {
      console.error(error);
      throw new Error("Database error");
    }
  }

  async getUserById(id: string): Promise<UserDTO | null> {
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
    } catch (e: unknown) {
      console.error(e);

      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new Error("User not found");
      }

      throw new Error("Failed to fetch user");
    }
  }

  async getUserByIdSafely(id: string): Promise<UserIdAndRole | null> {
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
    } catch (e: unknown) {
      console.error(e);
      throw new Error("Failed to fetch user");
    }
  }

  async createUser(userArgs: UserEntity): Promise<UserIdAndRole> {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: userArgs.name ?? "",
          username: userArgs.username ?? "",
          role: "USER",
        },
      });
      return { ...user, name: user.name ?? "" };
    } catch (e: unknown) {
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
            role: args.role ?? "USER",
            username: args.username ?? "",
            name: args.name ?? "",
          },
        })
        .then((user) => ({
          ...user,
          name: user.name ?? "",
        }));
    } catch (e: unknown) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
        throw new Error("Unique constraint failed on the fields: (`username`)");
      }
      throw new Error("Database error");
    }
  };

  getUserByUsername = async (
    username: string,
  ): Promise<UserIdAndRole | null> => {
    try {
      const result = await this.prisma.user.findUniqueOrThrow({
        select: {
          id: true,
          name: true,
          username: true,
          role: true,
        },
        where: {
          username,
        },
      });

      return {
        ...result,
        name: result.name ?? "",
      };
    } catch (e: unknown) {
      console.error(e);

      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new Error("Incorrect username or password");
      }
      throw new Error("Database error");
    }
  };
}
