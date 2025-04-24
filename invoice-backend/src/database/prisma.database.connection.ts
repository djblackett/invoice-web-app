import { inject, injectable } from "inversify";
import { PrismaClient } from "@prisma/client";
import { IDatabaseConnection } from "./database.connection";
import TYPES from "@/constants/identifiers";
import { Logger } from "@/config/logger.config";

@injectable()
export class DatabaseConnection implements IDatabaseConnection {
  constructor(
    @inject(TYPES.PrismaClient) public prisma: PrismaClient,
    @inject(TYPES.Logger) public logger: Logger,
  ) {}

  public getDatabase() {
    return this.prisma;
  }

  public async initConnection(): Promise<void> {
    try {
      await this.prisma.$connect();
      this.logger.info("Connected to Prisma");
    } catch (e) {
      this.logger.error(e instanceof Error ? e.message : String(e));
      await this.prisma.$disconnect();
      process.exit(1);
    }
  }
}
