# Clean Architecture on the Backend: The Repository Should Not Invent the Rule

In the frontend article, the architectural problem became clear once I knew what to look for. A button click handler had become the place where an invoice rule lived.

The component was doing too much, but React was not the real issue. The rule had simply stayed in the first place where it worked.

The backend has the same problem, just in a more respectable disguise.

On the frontend, rules settle into buttons, hooks, form handlers, and cache updates. On the backend, they settle into resolvers, services, mappers, validators, and ORM calls. The folders look more serious because they have names like `services`, `repositories`, `GraphQL`, and `validators`, but folder names do not create boundaries by themselves.

The backend version of the frontend rule is this:

```txt
The button should reflect the rule, not define it.
```

The companion backend rule is:

```txt
The repository should persist the result of a rule, not invent the rule.
```

That distinction is the thread through this article.

It is also where anemic models and Clean Architecture meet. Clean Architecture is about keeping policy on the inside and details on the outside: the rules that define the business should not depend on frameworks, transport, or the database. An anemic model makes that almost impossible, because the policy has no inward home to live in. With nowhere central to sit, it scatters outward into the very details it was supposed to stay independent of — the resolver, the mapper, the ORM call. So "give the rule a home" is not a separate concern from Clean Architecture. It is the precondition for it.

> A note on the code: this article uses the real invoice app as the example. Some snippets are from the current code. A few are from git history, because the older versions make the architectural drift easier to see. The "clean" snippets are the direction I would move the code toward, not a claim that the app already looks like this.

## The Same Problem on the Other Side

In the frontend article, components were not the villain. Components are fine. Hooks are fine. Apollo is fine. The trouble started when UI code became the accidental home of application rules.

The same is true on the backend. The tools are not the issue. Prisma can be the right persistence layer, GraphQL can be the right API boundary, and services and repositories can still be useful. The question is whether business decisions settle into those layers before the codebase has named them clearly.

This invoice app already has real backend architecture. The current code has GraphQL resolvers, services, repository interfaces, Prisma implementations, validation helpers, dependency injection, and tests. It is a long way from one giant resolver file calling Prisma directly.

But the invoice model is still mostly anemic.

The codebase has an `Invoice` shape:

```ts
export interface Invoice {
  createdBy?: UserIdAndRole | undefined;
  createdById?: string | undefined;
  clientAddressId?: string | undefined;
  clientAddress: ClientAddress | undefined;
  clientEmail: string;
  clientName: string;
  createdAt: string;
  description: string;
  id: string;
  items: Item[] | undefined;
  paymentDue: string;
  paymentTerms: number;
  senderAddress: SenderAddress | undefined;
  senderAddressId?: string | undefined;
  status: string;
  total: number;
}
```

That type tells me what fields an invoice has. It does not tell me what an invoice can do, or what rules make it valid.

The missing question is:

> Where does the codebase say what an invoice is allowed to do?

If the answer is "a little bit in the resolver, a little bit in the service, a little bit in the mapper, and a little bit in Prisma," the model is probably anemic.

## What Anemic Model Means Here

An anemic model is not the same thing as "using plain objects." Plain objects can be a perfectly reasonable choice.

The smell appears when the domain is represented mainly as data containers, while the behavior that gives those objects meaning is scattered through the rest of the application.

For an invoice app, these are not just implementation details:

- how item totals are calculated
- how invoice totals are calculated
- which statuses exist
- whether a draft can be incomplete
- whether a paid invoice can be edited
- whether only pending invoices can be marked paid
- who is allowed to mutate an invoice
- what defaults are valid for a new invoice

Those are domain or application rules. Some, like how a total is calculated or which status transitions are legal, are pure invoice-domain logic. Others, like who is allowed to mutate an invoice, are really application or authorization policy, because they depend on the current user as much as the invoice. Either way, they define what an invoice means and how it may be used in this app.

GraphQL can expose them. Prisma can persist their results. A service can coordinate them. React can display them. But none of those layers should be the first place where the rule is invented.

## The Code Got Better, But the Domain Is Still Thin

The history matters because the current backend is not where the code started.

An older `InvoiceService` from the architecture refactor was doing invoice work, user creation, login, password hashing, and user lookups from the same service:

```ts
export class InvoiceService {
  constructor(
    @inject(PrismaInvoiceRepository)
    private readonly invoiceRepo: PrismaInvoiceRepository,
  ) {}

  addInvoice = (invoice: Invoice) => {
    return this.invoiceRepo.create(invoice);
  };

  createUser = async (args: CreateUserArgs) => {
    const hashedPassword = await bcrypt.hash(args.password, 10);
    return await this.invoiceRepo.createUser(args, hashedPassword);
  };

  login = async (email: string, password: string) => {
    return await this.invoiceRepo.loginUser(email, password);
  };
}
```

That version had an obvious boundary problem. An invoice service was not just an invoice service. It also knew about users, login, and password hashing.

The repository was overloaded too. It queried invoices, validated invoice data, handled GraphQL errors, filled default invoice fields, created nested addresses and items, and had user-related methods nearby. It had become the place where unrelated backend concerns accumulated.

The current code is much better. User logic has its own services and repositories. The backend has an `IInvoiceRepo` interface. Prisma sits behind `PrismaInvoiceRepository`. The service receives its dependencies through Inversify. GraphQL resolvers call services instead of calling Prisma directly.

That progress matters. It just does not finish the architectural work.

Clean Architecture is not only about putting files in layers. A layered anemic model is still an anemic model. The remaining issue is subtler: the invoice rules still do not have a strong home.

## The Current Create Flow

The create flow shows the issue clearly.

The GraphQL schema accepts almost every invoice field directly:

```graphql
type Mutation {
  addInvoice(
    clientAddress: ClientInfo
    clientEmail: String
    clientName: String
    createdAt: String
    description: String
    id: String
    items: [ItemInput]
    paymentDue: String
    paymentTerms: Float
    senderAddress: SenderInfo
    status: String
    total: Float
  ): Invoice
}
```

And `ItemInput` carries its own `total`, so even line-item totals arrive from the client:

```graphql
input ItemInput {
  id: String
  name: String
  price: Float
  quantity: Int
  total: Float
}
```

This is the root of the drift, and it is worth naming up front: creating an invoice is not the same thing as accepting an invoice from the client. The mutation takes in something that already looks like a whole invoice — including `status`, `total`, and item totals, which the server should usually decide. Once the boundary accepts a transport-shaped almost-invoice, every later layer has to guess which fields are authoritative, and that guessing is what spreads across the service, the mapper, and the repository below.

The resolver passes those args to the service:

```ts
addInvoice: async (_root, args, context) => {
  const { invoiceService, pubsub } = context;

  const newInvoice = await invoiceService.addInvoice(args);
  await pubsub.publish("INVOICE_ADDED", { invoiceAdded: newInvoice });
  return newInvoice;
};
```

The service adds the authenticated user, maps the partial input to a fuller invoice shape, asks the repository to create it, then validates the result:

```ts
addInvoice = async (invoice: Invoice) => {
  if (!this.userContext) {
    throw new ValidationException("Unauthorized");
  }

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
  return validateInvoiceData(createdInvoice);
};
```

Then the mapper fills missing fields:

```ts
const invoiceWithDefaultValues: InvoiceWithCreatedBy = {
  id: invoice.id ?? "",
  clientEmail: invoice.clientEmail ?? "",
  clientName: invoice.clientName ?? "",
  description: invoice.description ?? "",
  createdAt: invoice.createdAt ?? new Date().toISOString(),
  status: invoice.status ?? "draft",
  paymentDue: invoice.paymentDue ?? new Date().toISOString(),
  paymentTerms: invoice.paymentTerms ?? 0,
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
```

Finally, the Prisma repository calculates totals and applies more defaults while creating the database row:

```ts
// Calculate total from items if not provided
const calculatedTotal =
  invoice.total ||
  (invoice.items ?? []).reduce((sum, item) => {
    const itemTotal = (item.quantity ?? 0) * (item.price ?? 0);
    return sum + itemTotal;
  }, 0);

const result = await this.prisma.invoice.create({
  data: {
    clientEmail: invoice.clientEmail || "",
    clientName: invoice.clientName || "",
    createdAt: invoice.createdAt || new Date().toISOString(),
    description: invoice.description || "",
    paymentDue:
      invoice.paymentDue ||
      new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    paymentTerms: invoice.paymentTerms || 14,
    status: invoice.status || "pending",
    total: new Prisma.Decimal(calculatedTotal),
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
  },
});
```

This works, which is why it is easy to leave alone. It is also where the architecture starts to blur.

The app has at least three places participating in the meaning of invoice creation:

- the GraphQL mutation accepts client-provided `status`, `total`, `paymentDue`, and `paymentTerms`
- the mapper fills defaults like `status: "draft"`, empty strings, zero totals, and empty item arrays
- the repository calculates item totals, calculates invoice total, and applies different defaults like `status: "pending"` and `paymentTerms: 14`

No single line is outrageous. The overall shape is what makes the code hard to reason about.

The code can create an invoice, but it is hard to answer a more important question:

> What is the one place where this app defines a valid new invoice?

## Calculations Inside Persistence

The invoice total is the clearest example.

An invoice total does not belong to the database, Prisma, or GraphQL. It is part of what an invoice means.

The repository needs to store the total. It may need to convert the total to `Prisma.Decimal`. It may need to map nested items to Prisma's `create` shape. Those are persistence responsibilities.

But this line crosses a boundary:

```ts
const itemTotal = (item.quantity ?? 0) * (item.price ?? 0);
```

The math is simple, and that is what makes the smell easy to miss.

The ORM adapter is deciding the business meaning of an invoice line item. It is also deciding the fallback behavior for missing quantity and price. And because the repository computes `calculatedTotal` as `invoice.total || (items reduced to a sum)`, it decides that a provided total overrides the calculated one unless that provided total is falsy.

Those are business decisions hidden inside persistence code.

Totals are not the only thing decided here. The same `create` method loads the user and throws `"User does not exist"` before it writes anything. Part of this is fair: the row connects to a `createdBy`, and the database will reject a bad foreign key on its own, so guarding referential integrity at the persistence edge is a legitimate persistence concern. The smell is not the check. It is that ownership is being *decided and assembled* late in the flow — the `createdBy` object is built in the service and stitched in just before the write — rather than established once, upstream, as part of constructing a valid invoice.

A repository should know how to persist an invoice, and it can reject data the database would reject anyway. It should not be the first place where the application defines how invoice totals work, or where the meaning of "this invoice belongs to this user" is assembled.

## Defaults Are Rules Too

Defaults look harmless. They feel like plumbing. In practice, they often are rules.

In the current create flow, two layers both set a default status. The mapper runs first, inside the service, and uses `??`:

```ts
status: invoice.status ?? "draft",
```

The repository runs next, and uses `||`:

```ts
status: invoice.status || "pending",
```

A draft and a pending invoice mean different things, so two layers disagreeing about the default is already a smell. The more revealing part is how the two operators interact, because `??` only falls back on `null` or `undefined`, while `||` falls back on any falsy value.

If the client omits status, the mapper fills `"draft"`, and the repository sees a truthy `"draft"` and leaves it alone. If the client sends an empty string, the mapper keeps the `""` (because `??` ignores it), and the repository turns that `""` into `"pending"`. Same operation, two different statuses, decided by which falsy value happened to arrive.

Payment terms have the same shape, and there the two layers quietly cancel each other out:

```ts
paymentTerms: invoice.paymentTerms ?? 0,
```

and later:

```ts
paymentTerms: invoice.paymentTerms || 14,
```

A missing payment term becomes `0` in the mapper, and then `0 || 14` becomes `14` in the repository. The mapper's default of `0` never survives. So the real question — does the app's default payment term mean zero days or fourteen days? — does have an answer, but you can only find it by tracing both layers and remembering that `0` is falsy.

The problem is not that no layer decides. For an omitted status, the mapper plainly chooses `"draft"`. The problem is that the meaning changes depending on which kind of "missing" value arrives. An omitted field and an empty-string field take different paths and end up with different statuses, and the only way to know which path you are on is to trace both layers. The meaning is discovered by reading fallback mechanics, not by reading a named rule.

Those answers should not be decided accidentally by `??` in a mapper and `||` in a Prisma call.

## Shape Validation Is Not Domain Behavior

The backend has useful validation:

```ts
export const validateInvoiceData = (inputs: unknown) => {
  const validationResult = invoiceZod.safeParse(inputs);

  if (validationResult.success) {
    return validationResult.data;
  }

  throw new ValidationException(
    `Validation failed: ${JSON.stringify(validationResult.error.issues)}`,
  );
};
```

That is valuable. Boundary validation matters. I want the backend to reject data that does not match the expected shape.

But validation is not the same as domain behavior.

Shape validation can answer questions like:

- is `clientEmail` a string?
- is `items` an array?
- is `paymentTerms` a number?
- is `total` present?

Domain behavior asks different questions:

- should the client be allowed to provide `total` at all?
- should the server always calculate it?
- can a draft have zero items?
- can a pending invoice have zero items?
- can a paid invoice be edited?
- can an invoice move from draft directly to paid?

Both kinds of questions matter. They should not be treated as the same responsibility.

Validators protect boundaries. They do not, by themselves, give the domain a home.

## Mappers Can Become Rule Engines

`mapPartialInvoiceToInvoice` is another useful example because its name sounds mechanical. It sounds like it is just translating one shape into another.

Some of that is exactly what it should do. It takes a partial invoice and builds the fuller object expected by the rest of the backend. It normalizes optional nested addresses. It guarantees a `createdBy` shape. Those are reasonable boundary tasks.

But mappers can quietly turn into rule engines.

This part is translation:

```ts
createdBy: {
  id: invoice.createdBy.id,
  name: invoice.createdBy.name ?? "",
  username: invoice.createdBy.username,
  role: invoice.createdBy.role ?? Role.USER,
}
```

Right next to it, the same function carries business meaning — it picks the default status, due date, payment terms, and total, the `status ?? "draft"` defaults we already saw in "Defaults Are Rules Too." That part is no longer translating a shape; it is deciding what an invoice is.

The distinction is not always obvious, and boundary normalization is real work. The test I use now is:

> Is this mapper translating data, or deciding what the business object means?

Building a `createdBy` shape is translation. Choosing what a missing status, due date, or total means is a decision, and I want that decision somewhere more explicit.

## The Mark-As-Paid Rule Has the Same Smell

The frontend article used the "Mark as Paid" button because it was small enough to understand and still big enough to reveal the problem.

The backend version is the service/repository pair.

The current service checks that there is a user, then delegates directly to the repository:

```ts
markAsPaid = async (id: string) => {
  if (!this.userContext) {
    throw new ValidationException("Unauthorized");
  }

  const result = await this.invoiceRepo.markAsPaid(id);
  return validateInvoiceData(result);
};
```

The repository updates the row:

```ts
async markAsPaid(id: string) {
  return await this.prisma.invoice.update({
    where: {
      id,
    },
    data: {
      status: "paid",
    },
    include: {
      items: true,
      clientAddress: true,
      senderAddress: true,
      createdBy: true,
    },
  });
}
```

The backend can mark an invoice as paid, but the rule is thin. It does not say "only pending invoices can be marked paid." It does not load the invoice and ask whether that transition is legal. It does not make the status transition a named part of the domain.

The repository updates a field. The service coordinates the call. The invoice itself never gets a say.

That is the anemic model in a small, concrete form.

## What a Less Anemic Model Could Look Like

Fixing this does not require a giant DDD framework or turning every object into a class. It starts by naming the rules that are currently hiding in infrastructure.

For example, item total calculation can become a domain function:

```ts
export type InvoiceStatus = "draft" | "pending" | "paid";

export type InvoiceItemInput = {
  id?: string;
  name: string;
  quantity: number;
  price: number;
};

export type InvoiceItem = InvoiceItemInput & {
  total: number;
};

export function createInvoiceItem(input: InvoiceItemInput): InvoiceItem {
  return {
    ...input,
    total: input.quantity * input.price,
  };
}

export function calculateInvoiceTotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.total, 0);
}
```

Then invoice creation can become a use case that constructs a meaningful invoice before it reaches Prisma:

```ts
export function createPendingInvoice(command: CreateInvoiceCommand): Invoice {
  const items = command.items.map(createInvoiceItem);

  return {
    id: createInvoiceId(),
    clientEmail: command.clientEmail,
    clientName: command.clientName,
    createdAt: command.createdAt,
    description: command.description,
    paymentDue: calculatePaymentDue(command.createdAt, command.paymentTerms),
    paymentTerms: command.paymentTerms,
    status: "pending",
    senderAddress: command.senderAddress,
    clientAddress: command.clientAddress,
    items,
    total: calculateInvoiceTotal(items),
    createdById: command.createdBy.id,
    createdBy: command.createdBy,
  };
}
```

Notice what the command does not carry. The invoice ID is generated here, not accepted from the client, and ownership is derived from the supplied `createdBy` rather than a separately trusted `createdById`. The use case takes facts and produces a complete, meaningful invoice.

The function is named `createPendingInvoice` for a reason. Drafts are a different operation, with different rules — a draft is allowed to be incomplete, so it would be its own use case (`createDraftInvoice`) with its own validation, not a flag threaded through one do-everything path. Naming the status into the use case is part of giving the rule a home: the name says which invariants apply.

With that in place, the repository becomes more boring, which is the point:

```ts
async create(invoice: InvoiceWithCreatedBy): Promise<unknown> {
  return this.prisma.invoice.create({
    data: {
      createdBy: {
        connect: { id: invoice.createdById },
      },
      id: invoice.id,
      clientEmail: invoice.clientEmail,
      clientName: invoice.clientName,
      createdAt: invoice.createdAt,
      description: invoice.description,
      paymentDue: invoice.paymentDue,
      paymentTerms: invoice.paymentTerms,
      status: invoice.status,
      total: new Prisma.Decimal(invoice.total),
      items: {
        create: invoice.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        })),
      },
    },
  });
}
```

The repository still has work to do. It maps from domain shape to Prisma shape. It creates nested rows. It converts the total to `Prisma.Decimal`.

But it no longer invents the invoice total. It no longer decides the default status. It no longer decides the meaning of missing item totals.

It persists an invoice whose meaning has already been established.

## Where Services Fit

None of this is an argument against services. The service layer is useful. It is where application workflow belongs.

For `markAsPaid`, the service should coordinate:

- require an authenticated user
- load the invoice through the repository
- enforce ownership or admin access
- apply the domain transition
- save the changed invoice
- validate or map the response

That could look like this:

```ts
async markAsPaid(id: string) {
  const user = requireUser(this.userContext);

  const invoice = await this.invoiceRepo.findByIdForUser(id, user);
  if (!invoice) {
    throw new NotFoundException("Invoice not found");
  }

  const paidInvoice = markInvoicePaid(invoice);
  const result = await this.invoiceRepo.update(id, paidInvoice);

  return validateInvoiceData(result);
}
```

The status transition itself belongs somewhere smaller and more explicit:

```ts
export function markInvoicePaid(invoice: Invoice): Invoice {
  if (invoice.status !== "pending") {
    throw new InvalidInvoiceStatusTransition(
      "Only pending invoices can be marked as paid",
    );
  }

  return {
    ...invoice,
    status: "paid",
  };
}
```

Note that this throws a domain-specific error, not `ValidationException`. In this codebase `ValidationException` carries an HTTP status code, so it belongs to the API boundary, not the domain. If the domain function threw it, the domain would once again know about transport-layer vocabulary — the same kind of leak this article is arguing against. The service, or the boundary above it, can then map that domain error to whatever HTTP or GraphQL error shape the client expects.

Now the service owns the workflow. The domain owns the rule. The repository owns persistence.

This mirrors the frontend split:

```txt
Component reflects the rule.
Hook coordinates the mutation.
Domain owns the rule.
```

On the backend:

```txt
Resolver receives the request.
Service coordinates the workflow.
Domain owns the rule.
Repository persists the result.
```

## The Boundary Should Narrow the Command

This brings us back to the point from the create flow: the GraphQL mutation accepts something close to a whole invoice, which makes it natural to pass `args` down into the service, then into a mapper, then into the repository. Creating an invoice is not the same thing as accepting an invoice from the client, and the fix is to make the boundary say so.

The client should not be the source of truth for every field. In particular, fields like `total`, `status`, `createdById`, and item totals are suspicious as input. They are usually derived by the server.

A narrower command makes the use case clearer:

```ts
type CreateInvoiceCommand = {
  clientEmail: string;
  clientName: string;
  description: string;
  createdAt: string;
  paymentTerms: number;
  clientAddress: ClientAddress;
  senderAddress: SenderAddress;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  createdBy: UserIdAndRole;
};
```

That command says, more clearly, which facts each side supplies. Most are client-provided. `createdBy` is the exception: it is the authenticated user, attached by the application layer from the request context, never trusted from the client payload.

One field in that list is worth a second look: `createdAt`. The name reads like a server creation timestamp, but in this app it is really the invoice date — a value the user picks, which also drives the payment due date. The schema even stores it as a plain `String`, while every genuine system timestamp in the database is a `DateTime` defaulting to `now()`. Keeping it in the command is correct, then, but only because it is a domain fact wearing a misleading name. If it were actually a creation timestamp, it would belong with the ID and status as something the server sets, not something the client sends.

The domain or use case then controls the rest, instead of accepting it from the client:

- the generated invoice ID
- status
- payment due date
- item totals
- invoice total
- ownership identifiers, derived from the authenticated `createdBy`

A small boundary change like this does a lot of work. Stop passing transport-shaped objects through every layer. Give the use case a command that matches the operation.

## Questions I Would Use

These are the checks I would keep nearby while cleaning this backend up.

### The Persistence Test

Would this logic still matter if I changed Prisma to another ORM, or stored invoices in a document database?

If yes, it probably does not belong in `PrismaInvoiceRepository`.

Invoice total calculation passes that test. Status transitions pass that test. Payment due date calculation passes that test.

### The Mapper Test

Is this code translating between shapes, or deciding what the business object means?

Translating `Prisma.Decimal` to `number` is mapping. Choosing that a missing status means `"draft"` is a rule. Choosing a different default in another layer, so the outcome depends on which falsy value arrives, is a conflicting rule.

### The Validator Test

Is this checking that data is shaped correctly, or enforcing what the domain is allowed to do?

Both are useful. They are not the same job.

### The Service Test

Is this method coordinating a workflow, or is it the only place where the business rule exists?

If the service says "load invoice, apply `markInvoicePaid`, save invoice," that is orchestration. If the service buries the whole rule inline, the rule is still hard to reuse and test.

### The Input Test

Should the client be allowed to send this field?

If the answer is no, it probably should not be part of the create command. `total`, item totals, status, and ownership are good candidates to derive server-side.

## The Real Lesson

Anemic models happen gradually.

Nobody sets out to put business rules in repositories. It happens because the repository is the first place where all the data is available. The Prisma `create` call already has the items, so calculating the total there feels convenient. The mapper already sees missing fields, so filling defaults there feels responsible. The validator already checks the shape, so adding a little more meaning there feels natural.

That is how rules stay where they first worked.

The frontend version of this problem was a button defining an invoice status rule. The backend version is subtler. A repository method looks serious. A mapper looks harmless. A validator looks responsible. But any of them can become the accidental home of the domain.

The goal is not to make the backend more elaborate. It is to make the rules visible.

An invoice total should be calculated in one named place. A status transition should be enforced in one named place. A repository should persist an invoice whose meaning has already been established.

The repository should store the result of the rule. It should not be where the rule is first invented.
