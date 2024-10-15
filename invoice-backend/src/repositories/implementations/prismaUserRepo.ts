import { inject, injectable } from "inversify";
import { IUserRepo } from "../userRepo";
import { DatabaseConnection } from "../../database/prisma.database.connection";
import { UserEntity, ReturnedUser, UserDTO } from "../../constants/types";
import { Prisma } from "@prisma/client";

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

  async findAllUsers() {
    try {
      return await this.prisma.user.findMany();
    } catch (error: any) {
      console.error(error);
      throw new Error("Database error");
    }
  }

  async findUserById(id: number): Promise<UserDTO> {
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

  async createUser(userArgs: UserEntity): Promise<ReturnedUser> {
    try {
      return this.prisma.user.create({
        data: {
          name: userArgs.name,
          username: userArgs.username,
          passwordHash: userArgs.passwordHash,
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

  findUserByUsername = async (username: string): Promise<UserEntity | null> => {
    try {
      const result = await this.prisma.user.findUniqueOrThrow({
        select: {
          id: true,
          name: true,
          username: true,
          passwordHash: true,
        },
        where: {
          username,
        },
      });

      return result;
    } catch (e: any) {
      console.error(e);

      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        throw new Error("Incorrect username or password");
      }
      throw new Error("Database error");
    }
  };
}
