import { Page, Locator, expect } from "@playwright/test";

/**
 * Custom assertion helpers for more granular and reusable test assertions
 */

/**
 * Assert that an invoice appears in the list with correct details
 */
export async function assertInvoiceInList(
  page: Page,
  clientName: string,
  options?: {
    status?: "Draft" | "Pending" | "Paid";
    total?: string;
  },
): Promise<void> {
  // Find the invoice row
  const invoiceRow = page.locator(`text=${clientName}`).first();
  await expect(invoiceRow).toBeVisible({ timeout: 5000 });

  if (options?.status) {
    const statusBadge = page
      .locator(`text=${clientName}`)
      .locator("..")
      .locator(`text=${options.status}`)
      .first();
    await expect(statusBadge).toBeVisible();
  }

  if (options?.total) {
    const totalAmount = page
      .locator(`text=${clientName}`)
      .locator("..")
      .locator(`text=${options.total}`)
      .first();
    await expect(totalAmount).toBeVisible();
  }
}

/**
 * Assert that an invoice does not appear in the list
 */
export async function assertInvoiceNotInList(
  page: Page,
  clientName: string,
): Promise<void> {
  const invoiceRow = page.locator(`text=${clientName}`).first();
  await expect(invoiceRow).not.toBeVisible({ timeout: 5000 });
}

/**
 * Assert invoice count in the list
 */
export async function assertInvoiceCount(
  page: Page,
  count: number,
): Promise<void> {
  // Adjust selector based on your actual invoice list item selector
  const invoiceItems = page.locator('[data-testid="invoice-item"]');
  await expect(invoiceItems).toHaveCount(count, { timeout: 5000 });
}

/**
 * Assert form validation error is shown
 */
export async function assertValidationError(
  locator: Locator,
  errorMessage?: string,
): Promise<void> {
  // Check for error state (adjust based on your implementation)
  const errorElement = errorMessage
    ? locator.locator(`text=${errorMessage}`)
    : locator.locator('[role="alert"]').or(locator.locator(".error"));

  await expect(errorElement).toBeVisible({ timeout: 3000 });
}

/**
 * Assert form has no validation errors
 */
export async function assertNoValidationErrors(page: Page): Promise<void> {
  const errorElements = page.locator('[role="alert"], .error');
  await expect(errorElements).toHaveCount(0);
}

/**
 * Assert invoice details match expected values
 */
export async function assertInvoiceDetails(
  page: Page,
  expected: {
    clientName?: string;
    clientEmail?: string;
    status?: string;
    total?: string;
    description?: string;
  },
): Promise<void> {
  if (expected.clientName) {
    const clientName = page.getByText(expected.clientName);
    await expect(clientName).toBeVisible();
  }

  if (expected.clientEmail) {
    const clientEmail = page.getByText(expected.clientEmail);
    await expect(clientEmail).toBeVisible();
  }

  if (expected.status) {
    const status = page.getByText(expected.status, { exact: true });
    await expect(status).toBeVisible();
  }

  if (expected.total) {
    const total = page.getByText(expected.total);
    await expect(total).toBeVisible();
  }

  if (expected.description) {
    const description = page.getByText(expected.description);
    await expect(description).toBeVisible();
  }
}

/**
 * Assert URL contains expected path
 */
export async function assertUrlContains(
  page: Page,
  path: string,
): Promise<void> {
  await expect(page).toHaveURL(new RegExp(path));
}

/**
 * Assert element has specific attribute value
 */
export async function assertAttribute(
  locator: Locator,
  attribute: string,
  value: string | RegExp,
): Promise<void> {
  await expect(locator).toHaveAttribute(attribute, value);
}

/**
 * Assert element contains specific class
 */
export async function assertHasClass(
  locator: Locator,
  className: string,
): Promise<void> {
  await expect(locator).toHaveClass(new RegExp(className));
}

/**
 * Assert toast/notification message appears
 */
export async function assertNotification(
  page: Page,
  message: string,
  type?: "success" | "error" | "warning" | "info",
): Promise<void> {
  const notification = page.locator(`text=${message}`).first();
  await expect(notification).toBeVisible({ timeout: 5000 });

  if (type) {
    const notificationContainer = notification.locator("..");
    await expect(notificationContainer).toHaveClass(new RegExp(type, "i"));
  }
}

/**
 * Assert multiple elements are visible
 */
export async function assertAllVisible(
  locators: Locator[],
): Promise<void> {
  for (const locator of locators) {
    await expect(locator).toBeVisible();
  }
}

/**
 * Assert button is enabled/disabled
 */
export async function assertButtonState(
  locator: Locator,
  enabled: boolean,
): Promise<void> {
  if (enabled) {
    await expect(locator).toBeEnabled();
  } else {
    await expect(locator).toBeDisabled();
  }
}

/**
 * Assert input field value matches expected
 */
export async function assertInputValue(
  locator: Locator,
  value: string,
): Promise<void> {
  await expect(locator).toHaveValue(value);
}

/**
 * Assert checkbox/radio is checked
 */
export async function assertChecked(
  locator: Locator,
  checked: boolean = true,
): Promise<void> {
  if (checked) {
    await expect(locator).toBeChecked();
  } else {
    await expect(locator).not.toBeChecked();
  }
}

/**
 * Assert text content matches (case-insensitive)
 */
export async function assertTextContains(
  locator: Locator,
  text: string,
  options?: { caseSensitive?: boolean },
): Promise<void> {
  const pattern = options?.caseSensitive
    ? new RegExp(text)
    : new RegExp(text, "i");
  await expect(locator).toContainText(pattern);
}

/**
 * Assert API response structure
 */
export function assertApiResponse(
  response: any,
  expectedFields: string[],
): void {
  for (const field of expectedFields) {
    expect(response).toHaveProperty(field);
  }
}

/**
 * Assert array length
 */
export function assertArrayLength(
  array: any[],
  length: number,
): void {
  expect(array).toHaveLength(length);
}

/**
 * Assert object contains properties
 */
export function assertObjectContains(
  obj: any,
  properties: Record<string, any>,
): void {
  for (const [key, value] of Object.entries(properties)) {
    expect(obj).toHaveProperty(key, value);
  }
}
