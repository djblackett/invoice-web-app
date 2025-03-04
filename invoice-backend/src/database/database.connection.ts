import { PrismaClient } from "@prisma/client";

export interface IDatabaseConnection {
  initConnection: () => Promise<void>;
  getDatabase: () => PrismaClient<{
    errorFormat: "pretty";
  }>;
}
