import { PrismaClient } from "@prisma/client";

type Mock = {

}

// todo - make this actually generic. This is a temporary hack to keep TS happy.

export interface IDatabaseConnection {
  initConnection: () => void;
  getDatabase: () => PrismaClient | Mock;
}


