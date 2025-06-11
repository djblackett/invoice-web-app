import "reflect-metadata";
import type { interfaces } from "inversify";
import { Container } from "inversify";
import { InvoiceService } from "../services/invoice.service";
import { UserService } from "../services/user.service";
import { RevisionService } from "../services/revision.service";
import { PrismaInvoiceRepository } from "../repositories/implementations/prismaInvoiceRepository";
import { PrismaUserRepository } from "../repositories/implementations/prismaUserRepo";
import { DatabaseConnection } from "../database/prisma.database.connection";
import { SQLiteDatabaseConnection } from "../database/sqlite.database.connection";
import { USE_SQLITE } from "./server.config";
import { Logger } from "./logger.config";
import { PubSub } from "graphql-subscriptions";
import TYPES from "../constants/identifiers";
import type { IInvoiceRepo } from "../repositories/InvoiceRepo";
import type { IUserRepo } from "../repositories/userRepo";
import { PrismaClient } from "@prisma/client";

const container = new Container();

container
  .bind<PrismaClient>(TYPES.PrismaClient)
  .toDynamicValue(() => {
    // This default binding will use process.env.DATABASE_URL.
    // In tests you can override it with the test-specific instance.
    return new PrismaClient();
  })
  .inSingletonScope();

container
  .bind<PrismaClient>(TYPES.PrismaClientDemo)
  .toDynamicValue(() => {
    // This binding is used for demo mode, where we use a different database URL.
    return new PrismaClient({
      datasourceUrl: process.env["DATABASE_URL_DEMO"] ?? "",
    });
  })
  .inSingletonScope();

// Bind a factory that returns the correct client based on a flag
container
  .bind<interfaces.Factory<PrismaClient, [boolean]>>(TYPES.PrismaClientFactory)
  .toFactory<PrismaClient, [boolean]>((context: interfaces.Context) => {
    return (isDemo: boolean) => {
      return isDemo
        ? context.container.get<PrismaClient>(TYPES.PrismaClientDemo)
        : context.container.get<PrismaClient>(TYPES.PrismaClient);
    };
  });

// Bind the appropriate database connection based on configuration
if (USE_SQLITE) {
  container.bind(TYPES.DatabaseConnection).to(SQLiteDatabaseConnection).inTransientScope();
} else {
  container.bind(TYPES.DatabaseConnection).to(DatabaseConnection).inTransientScope();
}

container
  .bind<IUserRepo>(TYPES.IUserRepo)
  .to(PrismaUserRepository)
  .inTransientScope();

container
  .bind<IInvoiceRepo>(TYPES.IInvoiceRepo)
  .to(PrismaInvoiceRepository)
  .inTransientScope();

// Bind Services
container
  .bind<UserService>(TYPES.UserService)
  .to(UserService)
  .inTransientScope();

container
  .bind<InvoiceService>(TYPES.InvoiceService)
  .to(InvoiceService)
  .inTransientScope();

container
  .bind<RevisionService>(TYPES.RevisionService)
  .to(RevisionService)
  .inTransientScope();

container.bind<Logger>(TYPES.Logger).to(Logger).inSingletonScope();
container.bind<PubSub>(TYPES.PubSub).toConstantValue(new PubSub());

// uncomment for verbose logging
container.applyMiddleware((planAndResolve) => {
  return (args) => {
    console.log(`Resolving ${args.serviceIdentifier.toString()}`);
    return planAndResolve(args);
  };
});

export default container;
