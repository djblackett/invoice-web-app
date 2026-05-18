import { inject, injectable } from "inversify";
import type { IUserRepo } from "../userRepo";
import { DatabaseConnection } from "../../database/prisma.database.connection";
import type {
  ReturnedUser,
  UserDTO,
  UserEntity,
  UserIdAndRole,
  UserWithPasswordHash,
} from "../../constants/types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import TYPES from "../../constants/identifiers";
import type { Logger } from "../../config/logger.config";

@injectable()
export class PrismaUserRepository implements IUserRepo {
  protected prisma;

  constructor(
    @inject(DatabaseConnection)
    databaseConnection: DatabaseConnection,
    @inject(TYPES.Logger)
    private readonly logger: Logger,
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
      this.logger.error(String(e));
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
      this.logger.error(String(e));
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
      this.logger.error(String(error));
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
      this.logger.error(String(e));

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
      this.logger.error(String(e));
      throw new Error("Failed to fetch user");
    }
  }

  async getUserForAuthentication(email: string): Promise<UserWithPasswordHash | null> {
    try {
      const user = await this.prisma.user.findUnique({
        select: {
          id: true,
          name: true,
          username: true,
          role: true,
          passwordHash: true,
        },
        where: {
          username: email,
        },
      });
      return user ? { ...user, name: user.name ?? undefined } : null;
    } catch (e: unknown) {
      this.logger.error(String(e));
      throw new Error("Failed to fetch user for authentication");
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
      this.logger.error(String(e));

      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new Error("Incorrect username or password");
      }
      throw new Error("Database error");
    }
  };
}
