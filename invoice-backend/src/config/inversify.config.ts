import "reflect-metadata";
import { Container } from "inversify";
import { DemoService } from "../services/demo.service";
import { InvoiceService } from "../services/invoice.service";
import { UserService } from "../services/user.service";
import { InvoiceRevisionService } from "../services/invoiceRevision.service";
import { PrismaInvoiceRepository } from "../repositories/implementations/prismaInvoiceRepository";
import { PrismaInvoiceRevisionRepository } from "../repositories/implementations/prismaInvoiceRevisionRepository";
import { PrismaUserRepository } from "../repositories/implementations/prismaUserRepo";
import { DatabaseConnection } from "../database/prisma.database.connection";
import { Logger } from "./logger.config";
import { PubSub } from "graphql-subscriptions";
import TYPES from "../constants/identifiers";
import type { IInvoiceRepo } from "../repositories/InvoiceRepo";
import type { IInvoiceRevisionRepo } from "../repositories/InvoiceRevisionRepo";
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

container.bind(DatabaseConnection).toSelf().inTransientScope();

container
  .bind<IUserRepo>(TYPES.IUserRepo)
  .to(PrismaUserRepository)
  .inTransientScope();

container
  .bind<IInvoiceRepo>(TYPES.IInvoiceRepo)
  .to(PrismaInvoiceRepository)
  .inTransientScope();

container
  .bind<IInvoiceRevisionRepo>(TYPES.IInvoiceRevisionRepo)
  .to(PrismaInvoiceRevisionRepository)
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
  .bind<InvoiceRevisionService>(TYPES.InvoiceRevisionService)
  .to(InvoiceRevisionService)
  .inTransientScope();

container
  .bind<DemoService>(TYPES.DemoService)
  .to(DemoService)
  .inTransientScope();

container.bind<Logger>(TYPES.Logger).to(Logger).inSingletonScope();
container.bind<PubSub>(TYPES.PubSub).toConstantValue(new PubSub());

export default container;
