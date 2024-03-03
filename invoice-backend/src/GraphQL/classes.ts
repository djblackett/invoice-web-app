// import {ContainerModule, inject, injectable, interfaces} from "inversify";
// import {GraphQLSchema} from "graphql/type";
// import {BaseMiddleware} from "inversify-express-utils";
// import {buildSchema} from "graphql/utilities";
// import TypeDefs from "./typeDefs";
// import TYPES from "../constants/identifiers";
// import {InvoiceRepository} from "../repositories/InvoiceRepository";
//
//
// const Schema: GraphQLSchema = buildSchema(TypeDefs);
//
// @injectable()
// class Resolver {
//     constructor(
//         @inject(TYPES.InvoiceRepository) private readonly invoiceRepository: InvoiceRepository) {
//     }
//
//     allInvoices() {
//         return this.invoiceRepository.findAll();
//     }
// }
//
// @injectable()
// class GraphQLHttpOptions implements GraphqlHTTP.OptionsData {
//     graphiql = true;
//
//     constructor(
//         @inject(TYPES.Schema) public schema: GraphQLSchema,
//         @inject(TYPES.Resolver) public rootValue: Resolver) {
//     }
// }
//
// @injectable()
// class GraphQLHttpMiddleware extends BaseMiddleware {
//     private readonly _middleware: graphqlHTTP.Middleware;
//
//     constructor(@inject(TYPES.GraphIQLHttpOptions) options) {
//         super();
//
//         this._middleware = graphqlHTTP(options);
//     }
//
//     public handler(request: Request, response: Response, next: NextFunction) {
//         void this._middleware(request, response);
//     }
// }
//
// const GraphQLHttpModule = new ContainerModule((bind: interfaces.Bind) => {
//     bind<GraphQLSchema>(TYPES.Schema).toConstantValue(Schema);
//     bind<Resolver>(TYPES.Resolver).to(Resolver).inSingletonScope();
//
//     bind<GraphQLHttpOptions>(TYPES.GraphQLHttpOptions).to(GraphQLHttpOptions).inSingletonScope();
//
//     bind<BaseMiddleware>(TYPES.GraphQLHttpMiddleware).to(GraphQLHttpMiddleware).inSingletonScope();
// });