import {Container} from 'inversify';
import {InvoiceService} from './src/services/invoiceService';
import {RepositoryInterface} from './src/repositories/RepositoryInterface';
import {PrismaRepository} from "./src/repositories/prismaRepositoryImpl";

const myContainer = new Container();
// myContainer.bind<InvoiceService>('InvoiceService').to(InvoiceService);
myContainer.bind<RepositoryInterface>('InvoiceRepository').to(PrismaRepository);

export {myContainer};
