import { injectable } from "inversify";
import { PrismaClient } from "@prisma/client";
import { IDatabaseConnection } from "./database.connection";
import { DB } from "../config/server.config";

console.log("DB.url", DB.url);

// Load environment variables based on environment
const environment = process.env.NODE_ENV || "development";
// dotenv.config({ path: `.env.${environment}` });

// Optionally override DATABASE_URL programmatically
process.env.DATABASE_URL = process.env.DATABASE_URL || environment;

// function getDatabaseUrl(env: string) {
//   switch (env) {
//     case "development":
//       return "postgresql://user:password@localhost:5432/dev_db";
//     case "staging":
//       return "postgresql://user:password@staging-db-host:5432/staging_db";
//     case "production":
//       return "postgresql://user:password@prod-db-host:5432/prod_db";
//     default:
//       throw new Error(`Unknown environment: ${env}`);
//   }
// }

@injectable()
export class DatabaseConnection implements IDatabaseConnection {
  static prisma = new PrismaClient({
    datasources: {
      db: {
        url: DB.url,
      },
    },
    errorFormat: "pretty",
    omit: {
      user: {
        passwordHash: true,
      },
    },
  });

  constructor() {} //

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
