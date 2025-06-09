const TYPES = {
  InvoiceService: Symbol.for("InvoiceService"),
  InvoiceRepository: Symbol.for("InvoiceRepository"),
  IInvoiceRepo: Symbol.for("IInvoiceRepo"),
  IUserRepo: Symbol.for("IUserRepo"),
  UserService: Symbol.for("UserService"),
  RevisionService: Symbol.for("RevisionService"),
  Controller: Symbol.for("Controller"),
  InvoiceResolver: Symbol.for("InvoiceResolver"),
  DatabaseConnection: Symbol.for("DatabaseConnection"),
  PubSub: Symbol.for("PubSub"),
  UserContext: Symbol.for("UserContext"),
  PrismaClient: Symbol.for("PrismaClient"),
  PrismaClientDemo: Symbol.for("PrismaClientDemo"),
  PrismaClientFactory: Symbol.for("PrismaClientFactory"),
  Logger: Symbol.for("Logger"),
} as const;

export default TYPES;
