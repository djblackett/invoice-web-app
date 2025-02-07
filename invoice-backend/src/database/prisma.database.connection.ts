import { inject, injectable } from "inversify";
import { PrismaClient } from "@prisma/client";
import { IDatabaseConnection } from "./database.connection";
import TYPES from "@/constants/identifiers";

@injectable()
export class DatabaseConnection implements IDatabaseConnection {
  constructor(@inject(TYPES.PrismaClient) public prisma: PrismaClient) {}

  public getDatabase() {
    return this.prisma;
  }

  public async initConnection(): Promise<void> {
    try {
      await this.prisma.$connect();
      console.log("Connected to Prisma");
    } catch (e) {
      console.error(e);
      await this.prisma.$disconnect();
      process.exit(1);
    }
  }
}
