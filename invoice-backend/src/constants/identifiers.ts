const TYPES = {
  InvoiceService: Symbol.for("InvoiceService"),
  InvoiceRepository: Symbol.for("InvoiceRepository"),
  IInvoiceRepo: Symbol.for("IInvoiceRepo"),
  IUserRepo: Symbol.for("IUserRepo"),
  UserService: Symbol.for("UserService"),
  Controller: Symbol.for("Controller"),
  InvoiceResolver: Symbol.for("InvoiceResolver"),
  DatabaseConnection: Symbol.for("DatabaseConnection"),
  PubSub: Symbol.for("PubSub"),
};

export default TYPES;
