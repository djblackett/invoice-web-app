import "reflect-metadata";
import {Container} from 'inversify';
import {InvoiceService} from './src/services/invoiceService';

import {RepositoryInterface} from './src/repositories/RepositoryInterface';
import {PrismaRepository} from "./src/repositories/prismaRepositoryImpl";
import {InvoiceRepository} from "./src/repositories/InvoiceRepository";

const myContainer = new Container();
// myContainer.bind<InvoiceService>('InvoiceService').to(InvoiceService);
myContainer.bind(InvoiceRepository).toSelf();
myContainer.bind(InvoiceService).toSelf();

export {myContainer};
