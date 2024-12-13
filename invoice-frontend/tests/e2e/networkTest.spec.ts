import test from "@playwright/test";
import fs from "fs";

test("Save HAR file", async ({ context, page }) => {
  await context.tracing.start();
  await page.goto("/invoice-web-app");
  await context.tracing.stop({ path: "trace.har" });
});

type Log = {
  type: string;
  url: string;
  method?: string;
  status?: number;
};

test("Capture and save network logs", async ({ page }) => {
  const logs: Log[] = [];

  // Capture network requests and responses
  page.on("request", (request) => {
    logs.push({
      type: "request",
      url: request.url(),
      method: request.method(),
    });
  });

  page.on("response", async (response) => {
    logs.push({
      type: "response",
      url: response.url(),
      status: response.status(),
    });
  });

  // Navigate and perform actions
  await page.goto("/invoice-web-app");

  // Save logs to a file
  fs.writeFileSync("network_logs.json", JSON.stringify(logs, null, 2));
});
