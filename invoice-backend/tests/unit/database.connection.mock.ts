import {
  DbClient,
  IDatabaseConnection,
  RepositoryDatabase,
} from "../../src/database/database.connection";
import prismaClient from "../../libs/prisma";

export class DatabaseConnectionMock
  implements IDatabaseConnection, RepositoryDatabase
{
  prisma: any;
  logger: any;
  initConnection: () => Promise<void> = () => {
    return Promise.resolve();
  };
  getDatabase = () => prismaClient;
  // Same root-connection semantics as DatabaseConnection.
  get client(): DbClient {
    return prismaClient;
  }
  atomic = <T>(work: (tx: DbClient) => Promise<T>): Promise<T> =>
    prismaClient.$transaction(work);
}
