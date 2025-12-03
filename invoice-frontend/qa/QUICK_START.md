# E2E Testing Quick Start Guide

## Overview

This test suite uses Playwright with the Page Object Model pattern, test data factories, and comprehensive helper utilities for fast, reliable E2E testing.

## Prerequisites

```bash
# Install dependencies
npm install

# Ensure environment variables are set
cp .env.example .env  # Then configure your values
```

## Environment Setup

Create/update `.env` file in `invoice-frontend` directory:

```env
TEST_BASE_URL=https://localhost:3000
TEST_LOGIN=your-test-email@example.com
TEST_PASSWORD=your-test-password
VITE_BACKEND_URL=https://localhost:4000/graphql
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm run test:e2e

# Run specific file
npx playwright test qa/tests/newInvoice.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run in UI mode (interactive)
npx playwright test --ui

# Run in debug mode
npx playwright test --debug
```

### Filter by Tags

```bash
# Run only smoke tests
npx playwright test --grep "@smoke"

# Run critical tests
npx playwright test --grep "@critical"

# Run all except slow tests
npx playwright test --grep-invert "@slow"

# Run fast UI tests
npx playwright test --grep "@fast.*@ui"
```

### View Reports

```bash
# View HTML report
npx playwright show-report

# View trace
npx playwright show-trace trace.zip
```

## Writing Your First Test

### 1. Create Test File

```typescript
// qa/tests/myFeature.spec.ts
import { test, expect } from "../fixtures/base";
import { generateInvoice } from "../factories/invoice.factory";
import { waitForNetworkIdle } from "../helpers/test.utils";
import { TEST_TAGS } from "../config/test.config";

test.describe(`My Feature ${TEST_TAGS.fast}`, () => {
  test.beforeEach(async ({ page, apiHelper }) => {
    await apiHelper.clearDatabase();
    await page.goto("/#/invoices");
    await waitForNetworkIdle(page);
  });

  test("should do something", async ({ page }) => {
    const invoiceData = generateInvoice();

    // Your test code here
    await expect(page.getByText(invoiceData.clientName)).toBeVisible();
  });
});
```

### 2. Use Factories for Test Data

```typescript
import { generateInvoice } from "../factories/invoice.factory";

// Generate unique invoice data
const invoice = generateInvoice();

// Override specific fields
const draftInvoice = generateInvoice({
  paymentTerms: "Net 30 Days",
  invoiceDate: "01/15/2025",
});
```

### 3. Use Page Objects

```typescript
import { NewInvoiceForm } from "../pages/newInvoice/newInvoiceForm";

const form = new NewInvoiceForm(page);
await form.createInvoice(invoiceData);
```

### 4. Use API Helpers

```typescript
// Fast setup via API
const created = await apiHelper.createInvoice(
  convertToApiInvoice(invoiceData)
);

// Cleanup
await apiHelper.deleteInvoice(created.id);
```

## Project Structure

```
qa/
├── config/                 # Configuration and constants
│   └── test.config.ts
├── factories/              # Test data generation
│   └── invoice.factory.ts
├── fixtures/               # Playwright fixtures
│   └── base.ts
├── helpers/                # Utilities
│   ├── api.helper.ts       # API operations
│   ├── assertions.helper.ts # Custom assertions
│   ├── date.helper.ts      # Date utilities
│   └── test.utils.ts       # Test utilities
├── pages/                  # Page Object Model
│   ├── base/
│   ├── edit/
│   ├── invoice-view/
│   ├── invoices/
│   └── newInvoice/
└── tests/                  # Test specifications
    ├── api/               # API tests
    ├── visual/            # Visual tests
    └── *.spec.ts          # UI tests
```

## Common Patterns

### Setup Invoice via API

```typescript
test.beforeEach(async ({ apiHelper }) => {
  const invoice = generateInvoice();
  const created = await apiHelper.createInvoice(
    convertToApiInvoice(invoice)
  );
  invoiceId = created.id;
});

test.afterEach(async ({ apiHelper }) => {
  if (invoiceId) {
    await apiHelper.deleteInvoice(invoiceId);
  }
});
```

### Wait for Actions

```typescript
import { waitForNetworkIdle, waitForText } from "../helpers/test.utils";

// Wait for network to be idle
await waitForNetworkIdle(page);

// Wait for specific text
await waitForText(page, "Invoice created");

// Wait for element with timeout
await expect(element).toBeVisible({ timeout: 5000 });
```

### Custom Assertions

```typescript
import { assertInvoiceInList } from "../helpers/assertions.helper";

await assertInvoiceInList(page, clientName, {
  status: "Paid",
  total: "$350.00",
});
```

## Best Practices

### ✅ DO

- Use test data factories for unique data
- Use API helpers for fast setup
- Use page objects for UI interactions
- Clean up test data in afterEach
- Use deterministic waits
- Tag tests appropriately
- Write descriptive test names

### ❌ DON'T

- Use hardcoded test data
- Use `waitForTimeout` (use proper waits)
- Create manual browser instances
- Mix test logic with cleanup
- Use brittle CSS selectors
- Leave test data in database

## Troubleshooting

### Tests are flaky

- Check for arbitrary `waitForTimeout` - replace with proper waits
- Ensure proper test isolation (beforeEach/afterEach)
- Verify no shared state between tests

### Tests are slow

- Use API helpers for setup instead of UI
- Enable parallel execution when ready
- Check for unnecessary waits

### Locators not found

- Use Playwright Inspector: `npx playwright test --debug`
- Verify element exists in DOM
- Check if data-testid is present
- Ensure page has loaded

### Authentication issues

- Check environment variables are set
- Verify `state.json` exists after global setup
- Check Auth0 configuration

## Additional Resources

- [README.md](README.md) - Complete testing guide
- [TESTING_GUIDELINES.md](TESTING_GUIDELINES.md) - Best practices
- [COMPLETE_IMPROVEMENTS.md](COMPLETE_IMPROVEMENTS.md) - All improvements
- [Playwright Documentation](https://playwright.dev)

## Quick Reference

### Test Tags
- `@smoke` - Critical smoke tests
- `@regression` - Full regression
- `@critical` - Critical path
- `@auth` - Authentication
- `@crud` - Create/Read/Update/Delete
- `@ui` - UI interactions
- `@api` - API integration
- `@slow` - Slow tests
- `@fast` - Fast tests

### Key Helpers

```typescript
// Factories
generateInvoice()
generateInvoiceItem()

// API
apiHelper.createInvoice()
apiHelper.deleteInvoice()
apiHelper.clearDatabase()

// Waits
waitForNetworkIdle(page)
waitForText(page, "text")
waitForElementHidden(element)

// Assertions
assertInvoiceInList(page, name, options)
assertValidationError(input, message)

// Dates
formatDate(date)
getTodayFormatted()
getFutureDateFormatted(days)
```

## Getting Help

1. Check the documentation files
2. Look at existing test examples
3. Use Playwright Inspector for debugging
4. Review the code review checklist in TESTING_GUIDELINES.md
