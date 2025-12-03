import { Page, Locator } from "@playwright/test";

/**
 * Date helper utilities for working with date pickers and date formatting
 */

/**
 * Format a Date object to MM/DD/YYYY string
 */
export function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

/**
 * Parse MM/DD/YYYY string to Date object
 */
export function parseDate(dateString: string): Date {
  const [month, day, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Get today's date formatted as MM/DD/YYYY
 */
export function getTodayFormatted(): string {
  return formatDate(new Date());
}

/**
 * Get date N days in the future formatted as MM/DD/YYYY
 */
export function getFutureDateFormatted(daysInFuture: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysInFuture);
  return formatDate(date);
}

/**
 * Get date N days in the past formatted as MM/DD/YYYY
 */
export function getPastDateFormatted(daysInPast: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysInPast);
  return formatDate(date);
}

/**
 * Get first day of current month
 */
export function getFirstDayOfMonth(): string {
  const date = new Date();
  date.setDate(1);
  return formatDate(date);
}

/**
 * Get last day of current month
 */
export function getLastDayOfMonth(): string {
  const date = new Date();
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return formatDate(lastDay);
}

/**
 * Simplified date picker interaction - just fill the input directly
 * This avoids the complex navigation logic
 */
export async function setDateDirectly(
  dateInput: Locator,
  dateString: string,
): Promise<void> {
  // Clear existing value
  await dateInput.clear();

  // Fill with new date
  await dateInput.fill(dateString);

  // Press Enter to confirm (some date pickers require this)
  await dateInput.press("Enter");
}

/**
 * Set date using keyboard navigation (alternative method)
 */
export async function setDateViaKeyboard(
  dateInput: Locator,
  dateString: string,
): Promise<void> {
  // Click to focus
  await dateInput.click();

  // Select all and delete
  await dateInput.press("Control+A");
  await dateInput.press("Backspace");

  // Type new date
  await dateInput.type(dateString);

  // Press Tab to move focus and trigger validation
  await dateInput.press("Tab");
}

/**
 * Get date with specific offset from a base date
 */
export function getDateWithOffset(
  baseDate: Date,
  daysOffset: number,
): string {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + daysOffset);
  return formatDate(date);
}

/**
 * Check if a date is within a range
 */
export function isDateInRange(
  dateString: string,
  startDate: string,
  endDate: string,
): boolean {
  const date = parseDate(dateString);
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  return date >= start && date <= end;
}

/**
 * Generate random date within a range
 */
export function getRandomDateInRange(
  startDate: Date,
  endDate: Date,
): string {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const randomTime = start + Math.random() * (end - start);
  return formatDate(new Date(randomTime));
}

/**
 * Calculate payment due date based on payment terms
 */
export function calculateDueDate(
  invoiceDate: string,
  paymentTermDays: number,
): string {
  const date = parseDate(invoiceDate);
  date.setDate(date.getDate() + paymentTermDays);
  return formatDate(date);
}

/**
 * Get payment term days from string
 */
export function getPaymentTermDays(paymentTerm: string): number {
  const match = paymentTerm.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}
