import "reflect-metadata";
import { Container } from "inversify";
import { InvoiceService } from "../services/invoice.service";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { TokenService } from "../services/token.service";
import { PrismaInvoiceRepository } from "../repositories/implementations/prismaInvoiceRepository";
import { PrismaUserRepository } from "../repositories/implementations/prismaUserRepo";
import { PrismaAuthRepository } from "../repositories/implementations/prismaAuthRepository";
import { DatabaseConnection } from "../database/prisma.database.connection";
import { Logger } from "./logger.config";
import { PubSub } from "graphql-subscriptions";
import TYPES from "../constants/identifiers";
import type { IInvoiceRepo } from "../repositories/InvoiceRepo";
import type { IUserRepo } from "../repositories/userRepo";
import type { IAuthRepo } from "../repositories/authRepo";
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
  .bind<IAuthRepo>(TYPES.AuthRepo)
  .to(PrismaAuthRepository)
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

container.bind(TokenService).toSelf().inSingletonScope();

container.bind(AuthService).toSelf().inTransientScope();

container.bind<Logger>(TYPES.Logger).to(Logger).inSingletonScope();
container.bind<PubSub>(TYPES.PubSub).toConstantValue(new PubSub());

// Verbose logging middleware - uncomment if needed for debugging
// container.applyMiddleware((planAndResolve) => {
//   return (args) => {
//     const logger = container.get<Logger>(TYPES.Logger);
//     logger.debug(`Resolving ${args.serviceIdentifier.toString()}`);
//     return planAndResolve(args);
//   };
// });

export default container;
