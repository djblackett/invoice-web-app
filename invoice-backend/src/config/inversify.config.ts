import { Container } from "inversify";
import { InvoiceService } from "../services/invoice.service";
import { PrismaInvoiceRepository } from "../repositories/implementations/prismaInvoiceRepository";
import InvoiceController from "../controllers/invoice.controller";
import { DatabaseConnection } from "../database/prisma.database.connection";
import { Logger } from "./logger.config";


const container = new Container();

container.bind(DatabaseConnection).toSelf();
container.bind(InvoiceService).toSelf();
container.bind(PrismaInvoiceRepository).toSelf();
console.log("Binding InvoiceController", InvoiceController);
container.bind(InvoiceController).toSelf();
container.bind(Logger).toSelf();

export default container;
