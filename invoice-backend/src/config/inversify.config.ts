import "reflect-metadata";
import { Container } from "inversify";
import { InvoiceService } from "../services/invoice.service";
import { UserService } from "../services/user.service";
import { PrismaInvoiceRepository } from "../repositories/implementations/prismaInvoiceRepository";
import { PrismaUserRepo } from "../repositories/implementations/prismaUserRepo";
import InvoiceController from "../controllers/invoice.controller";
import { DatabaseConnection } from "../database/prisma.database.connection";
import { Logger } from "./logger.config";
import { PubSub } from "graphql-subscriptions";
import TYPES from "../constants/identifiers";
import { IInvoiceRepo } from "../repositories/InvoiceRepo";
import { IUserRepo } from "../repositories/userRepo";

const container = new Container();

container.bind(DatabaseConnection).toSelf();
container.bind(InvoiceService).toSelf();
container.bind(UserService).toSelf();
container.bind(PrismaInvoiceRepository).toSelf();
container.bind(PrismaUserRepo).toSelf();
container.bind<IUserRepo>(TYPES.IUserRepo).to(PrismaUserRepo);
container.bind<IInvoiceRepo>(TYPES.IInvoiceRepo).to(PrismaInvoiceRepository);
container.bind(InvoiceController).toSelf();
container.bind(Logger).toSelf();
container.bind<PubSub>(TYPES.PubSub).toConstantValue(new PubSub());

// uncomment for verbose logging
// container.applyMiddleware((planAndResolve) => {
//   return (args) => {
//     // eslint-disable-next-line @typescript-eslint/no-base-to-string
//     console.log(`Resolving ${args.serviceIdentifier.toString()}`);
//     return planAndResolve(args);
//   };
// });

export default container;
