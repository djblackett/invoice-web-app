# Clean Architecture on the Frontend: Beyond Smart and Dumb Components

For a long time, frontend architecture meant one thing to me: split components into smart and dumb. Smart components fetch data, hold state, call mutations, and pass callbacks down. Dumb components take props and render buttons, forms, tables, and layout.

That split helped. It made my React components smaller and gave me a vocabulary for "this component is doing too much." But as my invoice app grew, a different problem showed up underneath it.

The code was already organized. It had folders for features, forms, shared components, GraphQL queries, and utilities. It was not one giant file. From a distance it looked fine. The trouble was that the *rules* of the application were scattered. Some lived in buttons. Some in hooks. Some in form submit handlers. Some in shared utilities. Some were only implied by what a backend service method happened to do. The app worked, but I couldn't point at one place and say, "This is what an invoice means here."

That is the architecture problem I care about now.

> *A note on the code: this describes a refactor I'm in the middle of, not a finished result. The messy snippets are real — taken from the app's code and its git history. The clean snippets are the direction I'm working toward; most of them aren't merged yet, and some don't exist outside this article. Read them as the target, not as a claim about what's on `main` today.*

Clean Architecture on the frontend is not about copying backend folder layouts into React. It is about separating kinds of decisions:

- business meaning
- application workflow
- UI interaction
- framework orchestration
- infrastructure details

The container/presentational split is still useful, but it is shallow. It separates data wiring from rendering. It does not separate the rules of the application from the mechanics of the interface. So the question I ask now isn't "is this smart or dumb?" It's "what kind of decision is this, and where should that kind of decision live?"

## Why This Is Harder on the Frontend

Clean Architecture is easier to see on the backend, where the boundaries announce themselves: database access, HTTP controllers, repositories, services, auth providers, queues, file storage, external APIs. It's obvious why database code shouldn't define business rules.

On the frontend, everything seems to touch the UI. Business rules surface as disabled buttons, hidden actions, validation messages, redirects, confirmation dialogs, form defaults, badges, and status labels. Because a rule appears *through* the interface, it's tempting to file it under presentation. That's where frontend architecture quietly decays.

A rule does not become presentation logic merely because it is expressed through the UI.

In an invoice app, these are UI expressions:

- the "Mark as Paid" button is clickable
- the "Edit" button is shown or hidden
- the status badge is green, orange, or gray
- the form shows an error when there are no line items
- a toast appears after a mutation succeeds

Behind them sit rules of a different kind:

- only pending invoices can be marked as paid
- paid invoices cannot be edited
- drafts can be saved with incomplete required fields
- a submitted invoice needs valid line items
- an invoice total equals the sum of its item totals
- the payment due date is derived from the invoice date and payment terms

Those are not visual decisions. They define what the application means.

## The Mistake: Rules Live Where They First Worked

Here is a real pattern from the app. `MarkAsPaidButton` renders a button, runs an Apollo mutation, checks the invoice status, shows success and error toasts, and moves focus back to the edit button when the click is invalid.

The actual component carries more detail (toast configuration, theme lookup, an `onError` handler), but the shape is this:

```tsx
function MarkAsPaidButton({ invoice, editButtonRef }) {
  const [markAsPaid] = useMutation(MARK_AS_PAID);

  const handleClick = async () => {
    const status = invoice.status?.toLowerCase();

    if (status === "pending") {
      const response = await markAsPaid({
        variables: { markAsPaidId: invoice.id },
      });

      if (response.data) {
        toast.success("Invoice paid!");
      }
    } else {
      editButtonRef.current?.focus();
      toast.error("Cannot mark drafts as paid");
    }
  };

  return <button onClick={handleClick}>Mark as Paid</button>;
}
```

There's nothing wrong with how this was written; it's what you reach for when you're making a feature work. The issue is that five different decisions now share one function:

- rendering: show a button
- UI interaction: refocus the edit button after an invalid click
- framework orchestration: run an Apollo mutation
- feedback: show a toast
- business rule: only pending invoices can be marked as paid

The last one is the problem. The component didn't just *reflect* the rule — it became the place where the rule is *defined*.

That's fine until the rule is needed elsewhere: a toolbar that disables the button, a keyboard shortcut that marks an invoice paid, a backend that rejects the same invalid transition, a test that asserts which transitions are allowed. If the rule only exists inside a click handler, it's trapped in the UI.

## The Test That Sorts Decisions

One question separates the cases:

> Would this rule still matter if I rebuilt the UI in another framework, or shipped a mobile app?

"Only pending invoices can be marked as paid" would still matter in Vue, Svelte, React Native, a CLI, or an API. That's a domain rule.

"Refocus the edit button after an invalid click" would not. That's UI interaction. "Show a toast on success" is frontend feedback. "Call this GraphQL mutation with this variable name" is framework orchestration. These can cooperate, but they shouldn't all be defined by the same function.

## A More Useful Split

Frontend logic isn't one thing. I find five categories worth distinguishing.

**Display** — how should this appear? Should status be a badge? Should paid invoices use a green indicator? Should the empty list show an illustration? These belong close to components.

**Interaction** — how does the user work the screen? Is the delete modal open? Which field has focus? Should the drawer close after submission? These belong in components or UI hooks.

**Framework orchestration** — how do React and the data layer coordinate the operation? Which mutation runs? Which query refetches? Is the cache written manually? Does the route change after success? These belong in React-aware hooks, adapters, or infrastructure.

**Application workflow** — what is the user trying to accomplish, and what sequence makes it valid? What happens on submitting a new invoice, or saving a draft? What must be true before an invoice can be sent? These are use cases.

**Domain** — what are the meaningful rules of this app's world? What makes an invoice payable? Can it be edited? How is the total calculated? Which status transitions are valid? These should not live only inside components.

The dividing line: UI logic decides how meaning becomes visible and usable; domain and application logic decide what is meaningful and allowed.

## Naming the Rule

The `MarkAsPaidButton` handler isn't the only place that knows the status taxonomy. The toolbar derives its badge from the same statuses:

```tsx
// InvoiceToolbar.tsx — the badge knows the status set.
const invoiceStatus = useMemo(() => {
  if (invoice.status === "paid") return <InvoiceStatus statusType="paid" text="Paid" />;
  if (invoice.status === "pending") return <InvoiceStatus statusType="pending" text="Pending" />;
  if (invoice.status === "draft") return <InvoiceStatus statusType="draft" text="Draft" />;
}, [invoice]);
```

```tsx
// MarkAsPaidButton.tsx — the handler also knows what "pending" means.
const status = invoice.status?.toLowerCase();
if (status === "pending") {
  /* run the mutation */
}
```

Two components already encode invoice status independently. Neither is wrong on its own, but the knowledge "which statuses exist, and what each one permits" is now spread across the UI. The moment a third place needs it — a bulk "mark all paid" action, a route guard, an admin screen — it gets copied again, and the copies drift.

The first improvement is just to name the rules in one place. (The app started with `status` typed as a plain `string`; tightening it to a union is part of the change.)

```ts
type InvoiceStatus = "draft" | "pending" | "paid";

type Invoice = {
  id: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  clientEmail: string;
};

// Assumes status is normalized to lower case at the data boundary
// (see the note below), so these can compare directly.
export function canMarkInvoicePaid(invoice: Invoice): boolean {
  return invoice.status === "pending";
}

export function canEditInvoice(invoice: Invoice): boolean {
  return invoice.status !== "paid";
}

export function canSubmitInvoice(invoice: Invoice): boolean {
  return (
    invoice.status === "draft" &&
    invoice.items.length > 0 &&
    Boolean(invoice.clientEmail)
  );
}
```

Now both consumers reflect the rule instead of restating it. The handler asks the rule whether to proceed, and any toolbar can ask the same rule whether to disable:

```tsx
// In the handler:
if (canMarkInvoicePaid(invoice)) {
  /* run the mutation */
}

// In a toolbar:
<button disabled={!canMarkInvoicePaid(invoice)}>Mark as Paid</button>
<button disabled={!canEditInvoice(invoice)}>Edit</button>
```

Small change, real consequence. The rule now has a name and a single definition, so it can be tested without rendering React and reused by a button, a form, a route guard, a keyboard shortcut, or a use case. It also gives the backend a clear rule to mirror. The button state reflects the rule; it no longer defines it.

A practical note on the boundary. If `status` can arrive in mixed case from the API, normalize it once where API responses become domain objects, rather than scattering `toLowerCase()` through every rule. That mixed casing is exactly what pushed the early code to call `invoice.status?.toLowerCase()` at each point of use. The same goes for `items`: if it can be `undefined` in your real types, the domain function should receive an already-shaped `Invoice` whose `items` is guaranteed to be an array. Normalizing the data is the boundary's job, not the rule's.

## Hooks Are a Bridge, Not a Junk Drawer

Submit hooks are the other place responsibilities pile up. They start small and accrete, because every new requirement has an obvious nearby home.

Mine grew into a 319-line `useNewInvoiceForm` hook that owned the entire form lifecycle — new invoices, drafts, *and* edits — in one file. Its imports tell the story: `useMutation`, `flushSync`, `toast`, `useFormCaching`, React Router's `useParams`, React Hook Form, and the GraphQL documents, all in one place. Inside, it defined two mutations with hand-written cache writes, then a stack of handlers:

```ts
// Abbreviated from the original useNewInvoiceForm.tsx (~320 lines).
const [addInvoice] = useMutation(ADD_INVOICE, {
  refetchQueries: [{ query: ALL_INVOICES }],
  onError: (error) => console.error(error),
});

const [updateInvoice] = useMutation(EDIT_INVOICE, {
  update: (cache, { data: { editInvoice } }) => {
    cache.writeQuery({ /* manual cache surgery */ });
  },
});

const onSubmit = async (data) => {
  flushSync(() => setIsDraft(false));
  // validate, build the invoice, coerce numbers, set status = "pending",
  // run the mutation, clear cache, reset the field array...
};

const onSubmitDraft = async () => {
  await trigger();
  // re-collect errors, filter out "required" ones, toast the rest,
  // manually re-apply the leftover errors field-by-field (including
  // items[index].field), then build a draft and submit...
};

const onSubmitUpdate = async (data) => { /* the third variation */ };
```

The `onSubmitDraft` branch alone reconstructed React Hook Form's error state by hand — filtering error types, re-applying them per field, walking the `items` array index by index — interleaved with toasts and a draft-specific status rule. Validation policy, UI feedback, cache strategy, and the meaning of each invoice status were all braided together in one hook serving three flows.

A later refactor split that monolith into focused hooks — `useSubmitNewInvoice`, `useSubmitDraft`, `useSubmitEditedInvoice`, `useAddInvoice`, `useHandleFormReset`. That was a real improvement: each hook now serves one flow. Here's the new-invoice one, trimmed to essentials:

```ts
export const useSubmitNewInvoice = () => {
  const {
    methods,
    startDate,
    selectedPaymentOption,
    setIsCacheActive,
    setIsNewInvoiceOpen,
  } = useNewInvoiceContext();

  const { trigger, setError, getValues } = methods;
  const { handleAddInvoice } = useAddInvoice();
  const handleFormReset = useHandleFormReset();

  const onSubmit = async () => {
    const data = getValues();

    if (!data.items) {
      setError("items", { type: "custom", message: "An item must be added" });
      return;
    }

    const isValid = await trigger();
    if (!isValid) return;

    const newInvoice = createInvoiceObject(data, startDate, selectedPaymentOption);
    newInvoice.items = newInvoice.items.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      price: Number(item.price),
    }));
    newInvoice.status = "pending";

    setIsNewInvoiceOpen(false);
    await handleAddInvoice(newInvoice);
    setIsCacheActive(false);
    handleFormReset();
  };

  return onSubmit;
};
```

Splitting by flow fixed the size problem, but not the *layering* problem. This hook still coordinates several kinds of decision at once: validation, drawer state, cache state, invoice construction, item normalization, the status transition, and the mutation.

Some of that genuinely belongs here — coordinating React Hook Form, UI state, and a mutation is exactly a hook's job. But invoice construction isn't a React concern, and the meaning of "a submitted invoice is `pending`" isn't either. At this stage of the refactor those facts still live in a `createInvoiceObject` utility plus a couple of inline tweaks in the hook — loose, and easy to drift from whatever the backend believes. Smaller hooks were the right first move. The next move is to separate the *kinds* of work inside them: the hook should *coordinate* the workflow, not be the place the workflow is *defined*.

## Extracting the Meaning

One direction is to move the construction rules into a small domain/application layer. The helpers below don't exist in the app yet — they're the target shape:

```ts
export type NewInvoiceInput = {
  form: InvoiceFormValues;
  invoiceDate: Date;
  paymentTerms: number;
};

export function createPendingInvoice(input: NewInvoiceInput): Invoice {
  const invoice = buildInvoiceFromForm(input);
  const items = invoice.items.map(normalizeInvoiceItem);

  return {
    ...invoice,
    status: "pending",
    items,
    total: calculateInvoiceTotal(items),
    paymentDue: calculatePaymentDue(input.invoiceDate, input.paymentTerms),
  };
}

export function createDraftInvoice(input: NewInvoiceInput): Invoice {
  const invoice = buildInvoiceFromForm(input);
  const items =
    invoice.items.length > 0
      ? invoice.items.map(normalizeInvoiceItem)
      : [emptyInvoiceItem()];

  return {
    ...invoice,
    status: "draft",
    items,
    total: calculateInvoiceTotal(items),
    paymentDue: calculatePaymentDue(input.invoiceDate, input.paymentTerms),
  };
}
```

In practice, factories like these straddle the boundary between domain and application. The calculations — normalizing items, summing the total, deriving the due date — are domain rules. *Choosing* `pending` for a submitted form, and allowing incomplete drafts, is part of the submit workflow. Keeping both in one function is fine, as long as you can still see which half is which.

Then the hook gets honest about its job:

```ts
export const useSubmitNewInvoice = () => {
  const form = useNewInvoiceContext();
  const { handleAddInvoice } = useAddInvoice();

  return async () => {
    const data = form.methods.getValues();

    if (!hasAtLeastOneItem(data)) {
      form.methods.setError("items", {
        type: "custom",
        message: "An item must be added",
      });
      return;
    }

    const isValid = await form.methods.trigger();
    if (!isValid) return;

    const invoice = createPendingInvoice({
      form: data,
      invoiceDate: form.startDate ?? new Date(),
      paymentTerms: form.selectedPaymentOption,
    });

    form.setIsNewInvoiceOpen(false);
    await handleAddInvoice(invoice);
    form.setIsCacheActive(false);
    form.resetInvoiceForm();
  };
};
```

This isn't about shrinking the hook. The hook still owns React Hook Form, drawer state, and mutation timing — frontend orchestration, all of it. What changes is that the total calculation, the due-date derivation, and the status choice move out of a loose utility and into a named layer that a test, the backend, or a future client can reason about. Those are invoice concerns, not React concerns.

## What Should Stay Close to React

Clean Architecture turns harmful when it treats React as an annoying detail to be hidden. React isn't the domain, but it is a real part of the frontend model. Rendering, interaction, cache coordination, forms, focus, suspense, route transitions, optimistic updates, and loading states all depend on the framework and its libraries.

These should stay close to React:

- whether the delete modal is open
- whether the form drawer is visible
- which button receives focus after an invalid action
- how loading and error states render
- whether Apollo refetches a query or writes the cache
- whether a toast appears after success
- whether the form closes before or after the mutation resolves
- how the toolbar lays out on mobile

I wouldn't promote `setIsNewInvoiceOpen(false)` into domain logic. That's UI state. I wouldn't hide `refetchQueries: [{ query: ALL_INVOICES }]` behind a domain abstraction either. That's Apollo orchestration. And `toast.success("Invoice created!")` is UI feedback, not a business service call.

Pull business rules out of React. Leave rendering strategy with the renderer.

## The Opposite Mistake: Moving the Mess Into a "Service"

Once you notice components doing too much, the reflex is to create a service and dump everything in it:

```ts
invoiceService.submitInvoiceAndShowToastAndInvalidateCacheAndCloseDrawerAndNavigate();
```

It *feels* architectural because the word "service" is in it. But nothing was separated — the mixed responsibilities just moved out of JSX. That one method still folds together application rules, an API mutation, cache invalidation, a toast, navigation, and UI state. That's a large component in disguise.

A cleaner split:

- Domain rules decide whether an invoice can be submitted or marked paid.
- Application use cases run the meaningful workflows.
- Repositories talk to GraphQL or another API.
- React hooks coordinate mutations, cache, form libraries, and feedback.
- Components render controls and reflect state.

The aim isn't fewer files. It's fewer reasons for a given file to change.

## A Practical Structure for the Invoice Feature

Not every feature needs domain/application/infrastructure/presentation folders. That's ceremony when the rules are thin. But for invoices, where the product rules are real and still growing, this shape earns its keep:

```txt
features/invoices/
  domain/
    invoiceRules.ts
    invoiceCalculations.ts
    invoiceFactory.ts

  application/
    markInvoicePaid.ts
    submitInvoice.ts
    saveDraftInvoice.ts
    InvoiceRepository.ts        // port (interface)

  infrastructure/
    graphqlInvoiceRepository.ts // adapter (implements the port)
    invoice.queries.ts
    invoiceDtoMappers.ts

  presentation/
    InvoiceToolbar.tsx
    MarkAsPaidButton.tsx
    InvoiceForm.tsx
    useSubmitNewInvoice.ts
    useMarkInvoicePaid.ts
```

The names matter less than the direction of dependency. Domain code imports nothing from React, Apollo, React Hook Form, styled-components, or a toast library. Application code expresses workflows in terms of domain rules and repository interfaces. Infrastructure code knows about GraphQL variables, DTOs, and API quirks. Presentation code knows about React, forms, layout, feedback, and interaction state.

That gives a quick smell test. If a function imports `toast`, `useMutation`, `useNewInvoiceContext`, or `styled-components`, it's presentation or orchestration. If it can run in a plain TypeScript unit test with only invoice data, it's a candidate for domain or application logic.

## The Backend Is Still the Boundary

Frontend rules are not security. If the frontend says only pending invoices can be marked paid, the backend must still enforce the transition. A user can bypass a disabled button, a frontend bug can fire the wrong mutation, a mobile client can drift from the web one.

On the backend, `markAsPaid` currently checks auth, delegates to the repository, and validates the returned shape:

```ts
markAsPaid = async (id: string) => {
  if (!this.userContext) {
    throw new ValidationException("Unauthorized");
  }

  const result = await this.invoiceRepo.markAsPaid(id);
  return validateInvoiceData(result);
};
```

That protects authentication, but the transition itself is still implicit — the service writes the new status without first asking whether the invoice is *allowed* to move to `paid`. The same transition rule belongs here too, on the authoritative side — though the backend should enforce it with its own implementation, not by importing the frontend function. (In this app the frontend and backend are separate packages with separate `Invoice` types, so sharing the literal code would couple two type systems across a boundary; mirror the rule, not the function.)

The frontend copy of the rule still earns its place. It improves UX, avoids pointless requests, keeps the UI consistent, and gives frontend tests a stable vocabulary. It just isn't the last line of defense.

## Putting It Together

Clean Architecture on the frontend doesn't make React disappear. The job is to keep React components from becoming the accidental home of the application's rules. The smart/dumb split separates data wiring from rendering; this separates business meaning from UI mechanics.

For the invoice app, that means moving away from:

```txt
Button click handler:
  check invoice status
  call GraphQL mutation
  show toast
  manage focus
  imply business rule
```

toward:

```txt
Domain:        canMarkInvoicePaid(invoice)
Application:   markInvoicePaid(invoiceId, repository)
Presentation:  useMutation, cache + toast, UI state
Component:     render the button, reflect whether the action is allowed
```

Not abstracting everything, not copying backend layouts blindly, and not pretending UI code is automatically "just UI." The interface is where the user experiences the rules. It shouldn't be the only place those rules exist.

## If You Take One Thing Away

Two heuristics carry most of this, and both fit in your head:

**The framework test — where does a decision belong?**

> Would this rule still matter if I rebuilt the UI in another framework, or shipped a mobile app?

If yes, it's a domain or application rule and shouldn't live inside a component. If no (focus, toasts, cache, drawer state), it's UI, and it should stay close to React.

**The import smell test — where does a piece of code already belong?**

> If a function imports `toast`, `useMutation`, a React context, or `styled-components`, it's presentation or orchestration. If it can run in a plain TypeScript unit test with only invoice data, it's a candidate for domain or application logic.

Everything else in this article is elaboration on those two questions. Apply them to one tangled component this week — not the whole app — and you'll feel where the seams actually are.
