import "reflect-metadata";
import { Container } from "inversify";
import { InvoiceService } from "../services/invoice.service";
import { UserService } from "../services/user.service";
import { PrismaInvoiceRepository } from "../repositories/implementations/prismaInvoiceRepository";
import { PrismaUserRepo } from "../repositories/implementations/prismaUserRepo";
import InvoiceController from "../controllers/invoice.controller";
import { DatabaseConnection } from "../database/prisma.database.connection";
import { Logger } from "./logger.config";

const container = new Container();

container.bind(DatabaseConnection).toSelf();
container.bind(InvoiceService).toSelf();
container.bind(UserService).toSelf();
container.bind(PrismaInvoiceRepository).toSelf();
container.bind(PrismaUserRepo).toSelf();
console.log("Binding InvoiceController", InvoiceController);
container.bind(InvoiceController).toSelf();
container.bind(Logger).toSelf();

export default container;
