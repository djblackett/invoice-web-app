const TYPES = {
  InvoiceService: Symbol.for("InvoiceService"),
  InvoiceRepository: Symbol.for("InvoiceRepository"),
  IInvoiceRepo: Symbol.for("IInvoiceRepo"),
  IInvoiceRevisionRepo: Symbol.for("IInvoiceRevisionRepo"),
  InvoiceRevisionService: Symbol.for("InvoiceRevisionService"),
  IUserRepo: Symbol.for("IUserRepo"),
  UserService: Symbol.for("UserService"),
  Controller: Symbol.for("Controller"),
  InvoiceResolver: Symbol.for("InvoiceResolver"),
  DatabaseConnection: Symbol.for("DatabaseConnection"),
  PubSub: Symbol.for("PubSub"),
  UserContext: Symbol.for("UserContext"),
  PrismaClient: Symbol.for("PrismaClient"),
  DemoService: Symbol.for("DemoService"),
  Logger: Symbol.for("Logger"),
  // Bound only inside a coordinated-write transaction scope.
  TransactionScope: Symbol.for("TransactionScope"),
} as const;

export default TYPES;
