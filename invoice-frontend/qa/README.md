# E2E Testing Guide

## Overview

This directory contains end-to-end (E2E) tests for the Invoice Web App using Playwright. The tests follow best practices including the Page Object Model (POM), test data factories, and proper test isolation.

## Directory Structure

```
qa/
├── factories/           # Test data factories for generating unique test data
│   └── invoice.factory.ts
├── fixtures/            # Playwright fixtures for reusable test setup
│   └── base.ts
├── helpers/             # Helper utilities for tests
│   ├── api.helper.ts    # API operations for setup/teardown
│   └── test.utils.ts    # Reusable test utilities
├── pages/               # Page Object Model classes
│   ├── base/
│   ├── edit/
│   ├── invoice-view/
│   ├── invoices/
│   └── newInvoice/
└── tests/               # Test specifications
    ├── accessibility/
    ├── editInvoice.spec.ts
    ├── invoices.spec.ts
    ├── invoiceView.spec.ts
    └── newInvoice.spec.ts
```

## Key Features

### 1. Test Data Factories

Tests use the `@faker-js/faker` library to generate unique, realistic test data for each test run.

**Example:**
```typescript
import { generateInvoice } from "../factories/invoice.factory";

const invoiceData = generateInvoice({
  paymentTerms: "Net 14 Days",
  // Override any fields you need
});
```

**Benefits:**
- No hardcoded test data
- Each test uses unique data (prevents test interference)
- Easy to generate specific scenarios

### 2. API Helpers

The `ApiHelper` class provides methods to interact with the backend API for faster test setup and teardown.

**Example:**
```typescript
test.beforeEach(async ({ apiHelper }) => {
  await apiHelper.clearDatabase();

  const invoice = convertToApiInvoice(generateInvoice());
  const result = await apiHelper.createInvoice(invoice);
});
```

**Benefits:**
- Faster test execution (API is faster than UI)
- More reliable test data setup
- Proper cleanup in afterEach hooks

### 3. Test Utilities

The `test.utils.ts` file provides reusable helper functions for common test operations.

**Example:**
```typescript
import { waitForNetworkIdle, waitForText } from "../helpers/test.utils";

await waitForNetworkIdle(page);
await waitForText(page, "Invoice created");
```

**Benefits:**
- No arbitrary `waitForTimeout` calls
- Deterministic waits based on actual conditions
- Reusable across all tests

### 4. Proper Test Isolation

Tests use `beforeEach` and `afterEach` hooks for setup and cleanup.

**Example:**
```typescript
test.describe("Invoice Tests", () => {
  let invoiceId: string;

  test.beforeEach(async ({ apiHelper }) => {
    // Setup: Create test data
    await apiHelper.clearDatabase();
    const result = await apiHelper.createInvoice(...);
    invoiceId = result.id;
  });

  test.afterEach(async ({ apiHelper }) => {
    // Cleanup: Remove test data
    if (invoiceId) {
      await apiHelper.deleteInvoice(invoiceId);
    }
  });
});
```

**Benefits:**
- Each test starts with a clean state
- No test pollution
- Tests can run in any order

### 5. Page Object Model

Page objects encapsulate page-specific logic and selectors.

**Example:**
```typescript
class NewInvoiceForm {
  async createInvoice(data: InvoiceData) {
    await this.fillInvoiceForm(data);
    await this.clickSaveButton();
    await waitForElementHidden(this.billFromText);
  }
}
```

**Benefits:**
- DRY (Don't Repeat Yourself)
- Easy to maintain when UI changes
- Readable test code

## Running Tests

### Prerequisites

```bash
npm install
```

### Environment Variables

Create a `.env` file in the `invoice-frontend` directory:

```env
TEST_BASE_URL=https://localhost:3000
TEST_LOGIN=your-test-email@example.com
TEST_PASSWORD=your-test-password
VITE_BACKEND_URL=https://localhost:4000/graphql
```

### Run All Tests

```bash
npm run test:e2e
```

### Run Specific Test File

```bash
npx playwright test qa/tests/newInvoice.spec.ts
```

### Run Tests in UI Mode

```bash
npx playwright test --ui
```

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

### View Test Report

```bash
npx playwright show-report
```

## Writing New Tests

### 1. Use Test Factories

```typescript
import { generateInvoice } from "../factories/invoice.factory";

test("should create invoice", async ({ page }) => {
  const invoiceData = generateInvoice();
  // Use invoiceData in your test
});
```

### 2. Use API for Setup

```typescript
test.beforeEach(async ({ apiHelper }) => {
  await apiHelper.clearDatabase();

  // Create test data via API
  const invoice = convertToApiInvoice(generateInvoice());
  await apiHelper.createInvoice(invoice);
});
```

### 3. Use Page Objects

```typescript
import { NewInvoiceForm } from "../pages/newInvoice/newInvoiceForm";

test("should create invoice", async ({ page }) => {
  const form = new NewInvoiceForm(page);
  await form.createInvoice(generateInvoice());
});
```

### 4. Use Test Utilities (No Arbitrary Waits!)

```typescript
import { waitForNetworkIdle, waitForText } from "../helpers/test.utils";

// ❌ DON'T DO THIS
await page.waitForTimeout(2000);

// ✅ DO THIS
await waitForNetworkIdle(page);
await waitForText(page, "Expected text");
```

### 5. Clean Up After Tests

```typescript
test.afterEach(async ({ apiHelper }) => {
  // Clean up test data
  if (createdId) {
    await apiHelper.deleteInvoice(createdId);
  }
});
```

## Best Practices

### ✅ DO

- Use test data factories for unique test data
- Use API helpers for fast setup/teardown
- Use proper waits (waitFor, expect) instead of timeouts
- Clean up test data in afterEach hooks
- Use descriptive test names
- Group related tests with test.describe()
- Use data-testid attributes for stable selectors

### ❌ DON'T

- Use hardcoded test data (like "Jack Sparrow")
- Use `waitForTimeout` for waits
- Mix test logic with cleanup code
- Create manual browser instances in tests
- Leave test data in the database after tests
- Use brittle CSS selectors

## Locator Strategy

Prioritize locators in this order:

1. **data-testid** - Most stable, recommended for dynamic content
   ```typescript
   page.getByTestId("newInvoiceButton")
   ```

2. **Role-based** - Good for semantic HTML
   ```typescript
   page.getByRole("button", { name: "Save" })
   ```

3. **Label** - Good for form fields
   ```typescript
   page.getByLabel("Email address")
   ```

4. **Text** - Use sparingly, can be fragile
   ```typescript
   page.getByText("Invoice created")
   ```

5. **CSS/XPath** - Last resort, very fragile
   ```typescript
   page.locator('input[name="clientName"]')
   ```

## Debugging Tests

### Take Screenshots

```typescript
import { takeDebugScreenshot } from "../helpers/test.utils";

await takeDebugScreenshot(page, "before-submit");
```

### Use Playwright Inspector

```bash
npx playwright test --debug
```

### View Traces

```bash
npx playwright show-trace trace.zip
```

## CI/CD Integration

Tests are configured to run in CI with:
- Single worker for consistency
- Video recording on failure
- Trace collection on retry
- HTML report generation

## Troubleshooting

### Tests Failing Randomly

- Check for arbitrary waits (waitForTimeout)
- Ensure proper test isolation (beforeEach/afterEach)
- Verify no shared state between tests

### Tests Timing Out

- Increase timeout in playwright.config.ts
- Check network conditions
- Verify backend is responsive

### Locators Not Found

- Use Playwright Inspector to debug selectors
- Verify element is in the DOM
- Check if element is in shadow DOM or iframe

## Future Improvements

- [ ] Enable parallel test execution
- [ ] Add visual regression testing
- [ ] Add performance testing
- [ ] Add API integration tests
- [ ] Add mobile viewport testing
- [ ] Add cross-browser testing
