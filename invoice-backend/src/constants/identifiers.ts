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
  UserContext: Symbol.for("UserContext"),
  PrismaClient: Symbol.for("PrismaClient"),
  Logger: Symbol.for("Logger"),
  // Auth-related types
  AuthRepo: Symbol.for("AuthRepo"),
  TokenService: Symbol.for("TokenService"),
  AuthService: Symbol.for("AuthService"),
  EmailService: Symbol.for("EmailService"),
  OAuthService: Symbol.for("OAuthService"),
};

export default TYPES;
