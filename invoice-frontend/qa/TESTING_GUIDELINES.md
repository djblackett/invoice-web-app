# Testing Guidelines and Best Practices

## Table of Contents

1. [Test Structure](#test-structure)
2. [Naming Conventions](#naming-conventions)
3. [Test Data Management](#test-data-management)
4. [Page Objects](#page-objects)
5. [Assertions](#assertions)
6. [Waits and Timeouts](#waits-and-timeouts)
7. [Test Isolation](#test-isolation)
8. [Common Patterns](#common-patterns)
9. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
10. [Code Review Checklist](#code-review-checklist)

## Test Structure

### File Organization

```
qa/
├── config/          # Test configuration and constants
├── factories/       # Test data generation
├── fixtures/        # Playwright fixtures
├── helpers/         # Reusable utilities
│   ├── api.helper.ts
│   ├── assertions.helper.ts
│   ├── date.helper.ts
│   └── test.utils.ts
├── pages/           # Page Object Model
└── tests/           # Test specifications
    ├── api/         # API integration tests
    └── visual/      # Visual regression tests
```

### Test File Structure

```typescript
import { test, expect } from "../fixtures/base";
import { TEST_TAGS } from "../config/test.config";

test.describe(`Feature Name ${TEST_TAGS.critical}`, () => {
  // Setup
  test.beforeEach(async ({ page, apiHelper }) => {
    await apiHelper.clearDatabase();
    // ... additional setup
  });

  // Cleanup
  test.afterEach(async ({ apiHelper }) => {
    // ... cleanup
  });

  // Tests
  test("should do something specific", async ({ page }) => {
    // Arrange
    const testData = generateInvoice();

    // Act
    await performAction();

    // Assert
    await expect(result).toBeVisible();
  });
});
```

## Naming Conventions

### Test Names

Use descriptive, behavior-driven names:

✅ **GOOD:**
```typescript
test("should display validation error when email is invalid")
test("should create draft invoice when save as draft is clicked")
test("should filter invoices by paid status")
```

❌ **BAD:**
```typescript
test("test 1")
test("email validation")
test("filter test")
```

### Variable Names

Use clear, descriptive names:

✅ **GOOD:**
```typescript
const invoiceData = generateInvoice();
const createdInvoiceId = result.id;
const newInvoiceButton = page.getByTestId("newInvoiceButton");
```

❌ **BAD:**
```typescript
const data = generateInvoice();
const id = result.id;
const btn = page.getByTestId("newInvoiceButton");
```

### Page Object Methods

Use action-oriented names:

✅ **GOOD:**
```typescript
async clickSaveButton()
async fillClientName(name: string)
async createInvoice(data: InvoiceData)
```

❌ **BAD:**
```typescript
async save()
async client(name: string)
async invoice(data: InvoiceData)
```

## Test Data Management

### Always Use Factories

✅ **GOOD:**
```typescript
const invoice = generateInvoice({
  clientName: "Specific Name",
  paymentTerms: "Net 30 Days",
});
```

❌ **BAD:**
```typescript
const invoice = {
  clientName: "John Doe", // Hardcoded
  clientEmail: "john@test.com", // Hardcoded
  // ... more hardcoded data
};
```

### Unique Data Per Test

Each test should use unique data to avoid conflicts:

```typescript
test("should create invoice", async ({ page }) => {
  // Each test run generates unique data
  const invoiceData = generateInvoice();
  await createInvoice(invoiceData);
});
```

### Override Only What You Need

```typescript
const invoice = generateInvoice({
  // Only override specific fields
  paymentTerms: "Net 1 Day",
});
// All other fields are randomly generated
```

## Page Objects

### Encapsulate All Page Logic

✅ **GOOD:**
```typescript
// In page object
class InvoicePage {
  async deleteInvoice(): Promise<void> {
    await this.clickDeleteButton();
    await this.clickDeleteButtonSecond();
    await waitForNetworkIdle(this.page);
  }
}

// In test
await invoicePage.deleteInvoice();
```

❌ **BAD:**
```typescript
// In test - exposing implementation details
await page.getByRole("button", { name: "Delete" }).click();
await page.getByRole("button", { name: "Delete" }).nth(1).click();
```

### Return Values Appropriately

```typescript
// Return locators for assertions in tests
getInvoiceElements(): Locator {
  return this.page.locator('[data-testid="invoice-item"]');
}

// Return primitives for data verification
async getInvoiceCount(): Promise<number> {
  return await this.getInvoiceElements().count();
}

// Return void for actions
async clickSaveButton(): Promise<void> {
  await this.saveButton.click();
}
```

## Assertions

### Use Custom Assertion Helpers

✅ **GOOD:**
```typescript
import { assertInvoiceInList, assertInvoiceCount } from "../helpers/assertions.helper";

await assertInvoiceInList(page, invoiceData.clientName, {
  status: "Paid",
});
await assertInvoiceCount(page, 3);
```

### Be Specific

✅ **GOOD:**
```typescript
await expect(invoiceDate).toHaveValue("01/30/2025");
await expect(statusBadge).toContainText("Paid");
await expect(total).toHaveText("$350.00");
```

❌ **BAD:**
```typescript
await expect(element).toBeVisible(); // Too generic
```

### Test Both Positive and Negative Cases

```typescript
test("should show validation error for invalid email", async ({ page }) => {
  await form.fillClientEmail("invalid-email");
  await assertValidationError(emailInput, "Please enter a valid email");
});

test("should not show error for valid email", async ({ page }) => {
  await form.fillClientEmail("valid@email.com");
  await assertNoValidationErrors(page);
});
```

## Waits and Timeouts

### Use Deterministic Waits

✅ **GOOD:**
```typescript
await waitForNetworkIdle(page);
await waitForText(page, "Invoice created");
await expect(element).toBeVisible({ timeout: 5000 });
```

❌ **BAD:**
```typescript
await page.waitForTimeout(2000); // Arbitrary wait
await page.waitForTimeout(5000);
```

### Wait for Specific Conditions

```typescript
// Wait for element state
await element.waitFor({ state: "visible" });
await element.waitFor({ state: "hidden" });

// Wait for network
await waitForNetworkIdle(page);
await waitForGraphQLRequest(page, "CreateInvoice");

// Wait for URL change
await waitForUrl(page, /\/invoices\/\d+/);
```

## Test Isolation

### Clean State Before Each Test

```typescript
test.beforeEach(async ({ apiHelper }) => {
  // Clear database
  await apiHelper.clearDatabase();

  // Navigate to clean state
  await page.goto("/#/invoices");
  await waitForNetworkIdle(page);
});
```

### Clean Up After Each Test

```typescript
test.afterEach(async ({ apiHelper }) => {
  // Delete created resources
  if (createdInvoiceId) {
    await apiHelper.deleteInvoice(createdInvoiceId);
  }
});
```

### Avoid Test Dependencies

❌ **BAD:**
```typescript
test("creates invoice", async () => {
  globalInvoiceId = await createInvoice();
});

test("edits invoice", async () => {
  // Depends on previous test
  await editInvoice(globalInvoiceId);
});
```

✅ **GOOD:**
```typescript
test("edits invoice", async ({ apiHelper }) => {
  // Self-contained test
  const invoice = await apiHelper.createInvoice(...);
  await editInvoice(invoice.id);
});
```

## Common Patterns

### API Setup, UI Verification

```typescript
test("should display created invoice", async ({ page, apiHelper }) => {
  // Setup via API (fast)
  const invoiceData = generateInvoice();
  const created = await apiHelper.createInvoice(
    convertToApiInvoice(invoiceData)
  );

  // Verify via UI
  await page.goto("/#/invoices");
  await assertInvoiceInList(page, invoiceData.clientName);

  // Cleanup
  await apiHelper.deleteInvoice(created.id);
});
```

### Parameterized Tests

```typescript
const statuses = ["Draft", "Pending", "Paid"] as const;

for (const status of statuses) {
  test(`should filter by ${status} status`, async ({ page }) => {
    // Test implementation
  });
}
```

### Conditional Test Execution

```typescript
test.skip(
  process.env.SKIP_VISUAL_TESTS === "true",
  "Visual regression test"
);

test.fixme("Known bug - skip until fixed");

test.slow(); // Mark as slow (3x timeout)
```

## Anti-Patterns to Avoid

### ❌ Hardcoded Test Data

```typescript
// BAD
await form.fillClientName("John Doe");

// GOOD
const invoice = generateInvoice();
await form.fillClientName(invoice.clientName);
```

### ❌ Arbitrary Waits

```typescript
// BAD
await page.waitForTimeout(2000);

// GOOD
await waitForNetworkIdle(page);
```

### ❌ Brittle Selectors

```typescript
// BAD
await page.locator("div > div > button").click();
await page.locator(".css-1234abc").click();

// GOOD
await page.getByTestId("newInvoiceButton").click();
await page.getByRole("button", { name: "Save" }).click();
```

### ❌ Testing Implementation Details

```typescript
// BAD - Testing internal state
expect(component.state.isLoading).toBe(false);

// GOOD - Testing user-visible behavior
await expect(loadingSpinner).not.toBeVisible();
```

### ❌ Multiple Assertions Without Context

```typescript
// BAD - Hard to debug which assertion failed
await expect(el1).toBeVisible();
await expect(el2).toBeVisible();
await expect(el3).toBeVisible();

// GOOD - Clear test intent
test("should display all invoice details", async ({ page }) => {
  await assertInvoiceDetails(page, {
    clientName: invoice.clientName,
    clientEmail: invoice.clientEmail,
    status: "Pending",
  });
});
```

## Code Review Checklist

Before submitting tests for review, ensure:

- [ ] Uses test data factories (no hardcoded data)
- [ ] Has proper test isolation (beforeEach/afterEach)
- [ ] No arbitrary waits (waitForTimeout)
- [ ] Uses page objects for UI interactions
- [ ] Has descriptive test names
- [ ] Includes both positive and negative test cases
- [ ] Uses custom assertion helpers where appropriate
- [ ] Cleans up test data
- [ ] Has appropriate test tags
- [ ] Follows the Arrange-Act-Assert pattern
- [ ] Uses stable selectors (data-testid preferred)
- [ ] Includes comments for complex logic only
- [ ] No skipped tests without explanation
- [ ] No console.log statements (use proper logging)

## Test Tags Reference

Use tags to categorize and filter tests:

```typescript
import { TEST_TAGS } from "../config/test.config";

test.describe(`Invoice CRUD ${TEST_TAGS.crud} ${TEST_TAGS.critical}`, () => {
  // Tests
});
```

Available tags:
- `@smoke` - Critical smoke tests
- `@regression` - Full regression suite
- `@critical` - Critical path tests
- `@auth` - Authentication tests
- `@crud` - Create/Read/Update/Delete tests
- `@ui` - UI interaction tests
- `@api` - API integration tests
- `@slow` - Slow-running tests
- `@fast` - Fast tests

## Running Tests by Tag

```bash
# Run only smoke tests
npx playwright test --grep "@smoke"

# Run all except slow tests
npx playwright test --grep-invert "@slow"

# Run critical CRUD tests
npx playwright test --grep "@critical.*@crud"
```

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)
- [Best Practices](https://playwright.dev/docs/best-practices)
