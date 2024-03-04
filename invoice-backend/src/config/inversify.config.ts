import { Container } from "inversify";
import { InvoiceService } from "../services/invoice.service";
import { InvoiceRepository } from "../repositories/InvoiceRepository";
import InvoiceController from "../controllers/invoice.controller";
import { DatabaseConnection } from "../database/database.connection";
import { Logger } from "./logger.config";


const container = new Container();

container.bind(DatabaseConnection).toSelf();
container.bind(InvoiceService).toSelf();
container.bind(InvoiceRepository).toSelf();
console.log("Binding InvoiceController", InvoiceController);
container.bind(InvoiceController).toSelf();
container.bind(Logger).toSelf();

export default container;
