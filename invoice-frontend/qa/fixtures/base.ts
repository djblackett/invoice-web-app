import { test as base, expect } from "@playwright/test";
import { createHash } from "node:crypto";

export const visitorTest = base.extend({
  context: async ({ context }, use, testInfo) => {
    // The local production backend trusts one proxy hop. Give each simulated
    // visitor a distinct private test IP; keep its real 100-request limit intact.
    const hash = createHash("sha256").update(testInfo.testId).digest();
    await context.setExtraHTTPHeaders({
      "X-Forwarded-For": `10.${hash[0]}.${hash[1]}.${hash[2]}`,
    });
    await use(context);
  },
});

export const test = visitorTest.extend<{ browserHealth: undefined }>({
  browserHealth: [
    async ({ page }, use, testInfo) => {
      const errors: string[] = [];
      const pending: Promise<void>[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("requestfailed", (request) => {
        // A navigation may cancel an obsolete request; other failures are errors.
        if (!request.failure()?.errorText.includes("ERR_ABORTED")) {
          errors.push(`${request.url()}: ${request.failure()?.errorText}`);
        }
      });
      page.on("response", (response) => {
        if (response.status() >= 400)
          errors.push(`${response.status()} ${response.url()}`);
        if (
          response.request().method() === "POST" &&
          response.url() === `${process.env.E2E_API_URL}/`
        ) {
          pending.push(
            response
              .json()
              .then((body) => {
                if (body.errors) errors.push(JSON.stringify(body.errors));
              })
              .catch(() => {}),
          ); // Navigating away can discard an already received body.
        }
      });
      await use(undefined);
      await Promise.all(pending);
      await testInfo.attach("browser-health", {
        body: JSON.stringify(errors, null, 2),
        contentType: "application/json",
      });
      expect(errors, "Console, runtime, HTTP and GraphQL errors").toEqual([]);
    },
    { auto: true },
  ],
});
export { expect };
