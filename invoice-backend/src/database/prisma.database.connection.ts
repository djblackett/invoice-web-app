import { inject, injectable } from "inversify";
import { PrismaClient } from "@prisma/client";
import { Logger } from "../config/logger.config";
import { IDatabaseConnection } from "./database.connection";

@injectable()
export class DatabaseConnection implements IDatabaseConnection {
  static prisma = new PrismaClient({
    errorFormat: "pretty",
  });

  constructor(@inject(Logger) private readonly logger: Logger) {}

  public getDatabase() {
    return DatabaseConnection.prisma;
  }

  public async initConnection(): Promise<void> {
    try {
      await DatabaseConnection.prisma.$connect();
      console.log("Connected to Prisma");
    } catch (e) {
      console.error(e);
      await DatabaseConnection.prisma.$disconnect();
      process.exit(1);
    }
  }
}