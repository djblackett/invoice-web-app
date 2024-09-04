import { IDatabaseConnection } from "../src/database/database.connection";
import prismaClient from "../libs/prisma";

export class DatabaseConnectionMock implements IDatabaseConnection {
  initConnection: () => Promise<void> = () => {
    return new Promise((_resolve, _reject) => {
      return;
    });
  };
  getDatabase = () => prismaClient;
}
