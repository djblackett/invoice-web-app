import {Container} from 'inversify';
import {InvoiceService} from '../services/invoice.service';
import {InvoiceRepository} from "../repositories/InvoiceRepository";
import {InvoiceController} from "../controllers/invoice.controller";
import {makeLoggerMiddleware} from "inversify-logger-middleware";
import TYPES from "../constants/identifiers";
import {DatabaseConnection} from "../database/database.connection";
import {Logger} from "./logger.config";
import "../controllers/invoice.controller";


const container = new Container();
// let logger = makeLoggerMiddleware();
// container.applyMiddleware(logger);

container.bind(DatabaseConnection).toSelf();
container.bind(InvoiceService).toSelf();
container.bind(InvoiceRepository).toSelf();
container.bind(InvoiceController).toSelf();
// container.bind<InvoiceService>(TYPES.InvoiceService).to(InvoiceService);
// container.bind<InvoiceRepository>(TYPES.InvoiceRepository).to(InvoiceRepository);
// myContainer.bind<InvoiceController>(TYPES.Controller).to(InvoiceController);
container.bind(Logger).toSelf();

export default container;


// Error: No matching bindings found for serviceIdentifier: t
// at _validateActiveBindingCount (/usr/src/app/node_modules/inversify/lib/planning/planner.js:82:23)
// at _getActiveBindings (/usr/src/app/node_modules/inversify/lib/planning/planner.js:68:5)
// at _createSubRequests (/usr/src/app/node_modules/inversify/lib/planning/planner.js:109:26)
// at /usr/src/app/node_modules/inversify/lib/planning/planner.js:133:17
// at Array.forEach (<anonymous>)
// at /usr/src/app/node_modules/inversify/lib/planning/planner.js:132:26
// at Array.forEach (<anonymous>)
// at _createSubRequests (/usr/src/app/node_modules/inversify/lib/planning/planner.js:112:20)
// at /usr/src/app/node_modules/inversify/lib/planning/planner.js:133:17
// at Array.forEach (<anonymous>)


// Error: Query root type must be provided.
// at assertValidSchema (/usr/src/app/node_modules/graphql/type/validate.js:59:11)
// at Function.generateSchemaDerivedData (/usr/src/app/node_modules/@apollo/server/src/ApolloServer.ts:726:22)
// at Object.schemaDerivedDataProvider (/usr/src/app/node_modules/@apollo/server/src/ApolloServer.ts:273:28)
// at new SchemaManager (/usr/src/app/node_modules/@apollo/server/src/utils/schemaManager.ts:79:36)
// at new ApolloServer (/usr/src/app/node_modules/@apollo/server/src/ApolloServer.ts:270:26)