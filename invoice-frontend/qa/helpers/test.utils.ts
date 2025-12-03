import { Page, Locator } from "@playwright/test";

/**
 * Wait for an element to be visible and stable (not animating)
 */
export async function waitForElementReady(
  locator: Locator,
  timeout: number = 5000,
): Promise<void> {
  await locator.waitFor({ state: "visible", timeout });
  // Wait for animations to complete
  await locator.evaluate((el) => {
    return Promise.all(
      el.getAnimations().map((animation) => animation.finished),
    );
  });
}

/**
 * Wait for network idle state
 */
export async function waitForNetworkIdle(
  page: Page,
  timeout: number = 10000,
): Promise<void> {
  await page.waitForLoadState("networkidle", { timeout });
}

/**
 * Wait for an element to be hidden/removed
 */
export async function waitForElementHidden(
  locator: Locator,
  timeout: number = 5000,
): Promise<void> {
  await locator.waitFor({ state: "hidden", timeout });
}

/**
 * Wait for a specific text to appear on the page
 */
export async function waitForText(
  page: Page,
  text: string,
  timeout: number = 5000,
): Promise<void> {
  await page.getByText(text).waitFor({ state: "visible", timeout });
}

/**
 * Type text with a realistic delay between keystrokes
 */
export async function typeWithDelay(
  locator: Locator,
  text: string,
  delay: number = 50,
): Promise<void> {
  await locator.click();
  await locator.pressSequentially(text, { delay });
}

/**
 * Scroll element into view if needed
 */
export async function scrollIntoView(locator: Locator): Promise<void> {
  await locator.scrollIntoViewIfNeeded();
}

/**
 * Wait for a specific URL pattern
 */
export async function waitForUrl(
  page: Page,
  urlPattern: string | RegExp,
  timeout: number = 5000,
): Promise<void> {
  await page.waitForURL(urlPattern, { timeout });
}

/**
 * Safely click an element (waits for it to be clickable)
 */
export async function safeClick(
  locator: Locator,
  timeout: number = 5000,
): Promise<void> {
  await locator.waitFor({ state: "visible", timeout });
  await locator.click({ timeout });
}

/**
 * Get text content safely
 */
export async function getTextContent(
  locator: Locator,
  timeout: number = 5000,
): Promise<string> {
  await locator.waitFor({ state: "visible", timeout });
  const text = await locator.textContent();
  return text?.trim() || "";
}

/**
 * Wait for element count to match expected
 */
export async function waitForElementCount(
  locator: Locator,
  count: number,
  timeout: number = 5000,
): Promise<void> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const currentCount = await locator.count();
    if (currentCount === count) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(
    `Expected ${count} elements, but found ${await locator.count()}`,
  );
}

/**
 * Wait for a GraphQL request to complete
 */
export async function waitForGraphQLRequest(
  page: Page,
  operationName: string,
  timeout: number = 10000,
): Promise<any> {
  const response = await page.waitForResponse(
    (response) => {
      const url = response.url();
      const request = response.request();
      const postData = request.postData();

      return (
        url.includes("graphql") &&
        postData?.includes(`"operationName":"${operationName}"`)
      );
    },
    { timeout },
  );

  return response.json();
}

/**
 * Wait for any GraphQL mutation to complete
 */
export async function waitForGraphQLMutation(
  page: Page,
  timeout: number = 10000,
): Promise<any> {
  const response = await page.waitForResponse(
    (response) => {
      const url = response.url();
      const request = response.request();
      const postData = request.postData();

      return (
        url.includes("graphql") &&
        postData?.includes("mutation") &&
        response.status() === 200
      );
    },
    { timeout },
  );

  return response.json();
}

/**
 * Wait for form submission to complete
 */
export async function waitForFormSubmission(
  page: Page,
  timeout: number = 10000,
): Promise<void> {
  await waitForGraphQLMutation(page, timeout);
  await waitForNetworkIdle(page, timeout);
}

/**
 * Generate a unique test identifier
 */
export function generateTestId(): string {
  return `test-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

/**
 * Take a screenshot with a descriptive name
 */
export async function takeDebugScreenshot(
  page: Page,
  name: string,
): Promise<void> {
  if (process.env.NODE_ENV === "CI" || process.env.DEBUG_SCREENSHOTS) {
    await page.screenshot({
      path: `debug-screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }
}
