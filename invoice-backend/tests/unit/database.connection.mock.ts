import { IDatabaseConnection } from "../../src/database/database.connection";
import prismaClient from "../../libs/prisma";

export class DatabaseConnectionMock implements IDatabaseConnection {
  prisma: any;
  logger: any;
  initConnection: () => Promise<void> = () => {
    return Promise.resolve();
  };
  getDatabase = () => prismaClient;
}
