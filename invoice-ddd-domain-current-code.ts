// Single-file excerpt for an AI code-modification prompt.
// Focus: refactor the current anemic invoice model toward DDD entities,
// value objects, and an Invoice aggregate.
//
// This intentionally removes repo imports, decorators, Prisma imports, GraphQL
// imports, and DI wiring so it can be pasted into a web chat as one file.

type Role = "USER" | "ADMIN";
type InvoiceStatus = string;

class ValidationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationException";
  }
}

class NotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundException";
  }
}

class InternalServerException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InternalServerException";
  }
}

interface Logger {
  error(message: string): void;
}

// The real GraphQL API returns this invoice shape. Keep valid responses
// compatible with these fields.
interface InvoiceApiResponse {
  createdBy?: UserIdAndRole;
  clientAddress?: Address;
  clientEmail: string;
  clientName: string;
  createdAt: string;
  description: string;
  id: string;
  items?: Item[];
  paymentDue: string;
  paymentTerms: number;
  senderAddress?: Address;
  status: string;
  total: number;
}

// Current backend types. These are plain data interfaces, so they do not own
// invoice behavior or invariants.
interface UserIdAndRole {
  id: string;
  role: Role | undefined;
  username?: string | undefined;
  name: string | undefined;
}

interface Address {
  city: string;
  country: string;
  postCode: string;
  street: string;
}

interface Item {
  id?: string | undefined;
  name: string | undefined;
  price: number | undefined;
  quantity: number | undefined;
  total: number | undefined;
}

interface Invoice {
  createdBy?: UserIdAndRole | undefined;
  createdById?: string | undefined;
  clientAddressId?: string | undefined;
  clientAddress: Address | undefined;
  clientEmail: string;
  clientName: string;
  createdAt: string;
  description: string;
  id: string;
  items: Item[] | undefined;
  paymentDue: string;
  paymentTerms: number;
  senderAddress: Address | undefined;
  senderAddressId?: string | undefined;
  status: InvoiceStatus;
  total: number;
}

interface InvoiceWithCreatedBy extends Invoice {
  createdBy: UserIdAndRole | undefined;
  createdById: string | undefined;
}

interface InvoiceCreateArgs {
  clientEmail: string;
  clientName: string;
  createdAt: string;
  description: string;
  id: string;
  paymentDue: string;
  paymentTerms: number;
  status: string;
  total: number;
  clientAddress: Address;
  senderAddress: Address;
  items: Item[];
}

// Current validation is mostly shape validation. In the real app this uses Zod:
// item.name is a string, price/quantity/total coerce to number, status is just
// string, paymentTerms is number, and items is an array. It does not enforce
// invoice rules like "quantity must be positive" or "total must equal sum".
function validateInvoiceData(inputs: unknown): Invoice {
  const invoice = inputs as Partial<Invoice>;

  if (!invoice.createdBy || !invoice.createdById) {
    throw new ValidationException("Validation failed: missing createdBy");
  }

  if (!invoice.clientAddress || !invoice.senderAddress) {
    throw new ValidationException("Validation failed: missing address");
  }

  if (!Array.isArray(invoice.items)) {
    throw new ValidationException("Validation failed: missing items");
  }

  return invoice as Invoice;
}

// Current mapper fills in missing values but does not model domain rules.
// This is part of what makes invoice creation anemic.
function mapPartialInvoiceToInvoice(
  invoice: Partial<Invoice>,
): InvoiceWithCreatedBy {
  if (
    !invoice.createdBy ||
    !invoice.createdBy.id ||
    !invoice.createdBy.username ||
    !invoice.createdById
  ) {
    throw new ValidationException("Invalid User data in invoice");
  }

  try {
    const invoiceWithDefaultValues: InvoiceWithCreatedBy = {
      id: invoice.id ?? "",
      clientEmail: invoice.clientEmail ?? "",
      clientName: invoice.clientName ?? "",
      description: invoice.description ?? "",
      createdAt: invoice.createdAt ?? new Date().toISOString(),
      createdBy: {
        id: invoice.createdBy.id,
        name: invoice.createdBy.name ?? "",
        username: invoice.createdBy.username,
        role: invoice.createdBy.role ?? "USER",
      },
      createdById: invoice.createdById,
      status: invoice.status ?? "draft",
      paymentDue: invoice.paymentDue ?? new Date().toISOString(),
      paymentTerms: invoice.paymentTerms ?? 0,
      clientAddress: {
        street: invoice.clientAddress?.street ?? "",
        city: invoice.clientAddress?.city ?? "",
        postCode: invoice.clientAddress?.postCode ?? "",
        country: invoice.clientAddress?.country ?? "",
      },
      senderAddress: {
        street: invoice.senderAddress?.street ?? "",
        city: invoice.senderAddress?.city ?? "",
        postCode: invoice.senderAddress?.postCode ?? "",
        country: invoice.senderAddress?.country ?? "",
      },
      items:
        invoice.items?.map((item) => ({
          id: item.id ?? "",
          name: item.name ?? "",
          price: item.price ?? 0,
          quantity: item.quantity ?? 0,
          total: item.total ?? 0,
        })) ?? [],
      total: invoice.total ?? 0,
    };

    return invoiceWithDefaultValues;
  } catch (e) {
    console.error(e);
    throw new ValidationException("Failed to map invoice data");
  }
}

// Current repository boundary. Only create is included because this prompt is
// about invoice creation, not reads, updates, or deletion.
interface IInvoiceRepo {
  create: (invoice: InvoiceWithCreatedBy) => Promise<unknown>;
}

// Current service orchestration. addInvoice attaches the user, maps/defaults
// the invoice, persists it, then validates the shape returned by the repository.
class InvoiceService {
  constructor(
    private readonly invoiceRepo: IInvoiceRepo,
    private readonly userContext: UserIdAndRole | null,
    private readonly logger: Logger,
  ) {}

  addInvoice = async (invoice: Invoice) => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }

    try {
      const invoiceWithUserInfo = {
        ...invoice,
        createdById: this.userContext.id,
        createdBy: {
          id: this.userContext.id,
          name: this.userContext.name,
          username: this.userContext.username ?? "",
          role: this.userContext.role,
        },
      };

      const fullInvoice = mapPartialInvoiceToInvoice(invoiceWithUserInfo);
      const createdInvoice = await this.invoiceRepo.create(fullInvoice);
      const validatedData = validateInvoiceData(createdInvoice);

      return validatedData;
    } catch (e) {
      this.logger.error(String(e));
      if (e instanceof ValidationException) {
        throw e;
      } else if (e instanceof NotFoundException) {
        throw e;
      } else {
        throw new InternalServerException("Internal server error");
      }
    }
  };
}

// Current GraphQL resolver entry point. addInvoice passes GraphQL args straight
// to the service as invoice data.
function getInvoiceResolvers() {
  return {
    Mutation: {
      addInvoice: async (
        _root: object,
        args: InvoiceCreateArgs,
        context: {
          invoiceService?: InvoiceService;
          pubsub?: {
            publish(eventName: string, payload: unknown): Promise<void>;
          };
        },
      ) => {
        const { invoiceService, pubsub } = context;
        if (!invoiceService || !pubsub) {
          throw new Error("Internal server error");
        }
        try {
          const newInvoice = await invoiceService.addInvoice(args);
          await pubsub.publish("INVOICE_ADDED", { invoiceAdded: newInvoice });
          return newInvoice;
        } catch (error) {
          throw new Error("Failed to add invoice");
        }
      },
    },
  };
}

// Simplified shape of the current Prisma repository create behavior.
// This is infrastructure code, but it currently contains invoice business
// calculations/defaults that are better suited to a domain model.
class PrismaInvoiceRepository implements IInvoiceRepo {
  constructor(
    private readonly prisma: any,
    private readonly logger: Logger,
  ) {}

  async create(invoice: InvoiceWithCreatedBy): Promise<unknown> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: invoice.createdById ?? "" },
      });
      if (!user) {
        throw new ValidationException("User does not exist");
      }

      // Current infrastructure-layer calculation: this trusts invoice.total if
      // it is truthy, otherwise it calculates from item quantity and price.
      const calculatedTotal =
        invoice.total ||
        (invoice.items ?? []).reduce((sum, item) => {
          const itemTotal = (item.quantity ?? 0) * (item.price ?? 0);
          return sum + itemTotal;
        }, 0);

      const result = await this.prisma.invoice.create({
        data: {
          createdBy: {
            connect: { id: invoice.createdById ?? "" },
          },
          ...(invoice.id && invoice.id !== "" && { id: invoice.id }),
          clientEmail: invoice.clientEmail || "",
          clientName: invoice.clientName || "",
          createdAt: invoice.createdAt || new Date().toISOString(),
          description: invoice.description || "",
          paymentDue:
            invoice.paymentDue ||
            new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          paymentTerms: invoice.paymentTerms || 14,
          status: invoice.status || "pending",
          total: calculatedTotal,
          items: {
            create: (invoice.items ?? []).map((item) => {
              const itemTotal = (item.quantity ?? 0) * (item.price ?? 0);
              return {
                name: item.name ?? "",
                quantity: item.quantity ?? 0,
                price: item.price ?? 0,
                total: item.total || itemTotal,
              };
            }),
          },
          ...(invoice.clientAddress && {
            clientAddress: {
              create: {
                city: invoice.clientAddress.city,
                country: invoice.clientAddress.country,
                postCode: invoice.clientAddress.postCode,
                street: invoice.clientAddress.street,
              },
            },
          }),
          ...(invoice.senderAddress && {
            senderAddress: {
              create: {
                city: invoice.senderAddress.city,
                country: invoice.senderAddress.country,
                postCode: invoice.senderAddress.postCode,
                street: invoice.senderAddress.street,
              },
            },
          }),
        },
        include: {
          items: true,
          clientAddress: true,
          senderAddress: true,
          createdBy: true,
        },
      });

      return {
        ...result,
        total: Number(result.total),
      };
    } catch (error: unknown) {
      this.logger.error("Error creating invoice: " + String(error));
      throw error;
    }
  }
}
