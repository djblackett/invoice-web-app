import { test, expect } from "../fixtures/base";
import { boot, dashboard } from "../helpers/invoice";

// The default build (temporary sessions OFF) must behave exactly as before:
// the shared identity, the shared reset on entry, no allocation, no stored
// credential.
test("the shared demo build keeps its identity, reset and storage", async ({
  page,
}) => {
  const operations: string[] = [];
  const authorizations = new Set<string>();
  const allocations: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "POST") return;
    if (new URL(request.url()).pathname === "/demo/sessions")
      allocations.push(request.url());
    const name = request.postDataJSON()?.operationName;
    if (name) {
      operations.push(name);
      const auth = request.headers()["authorization"];
      if (auth) authorizations.add(auth);
    }
  });
  await boot(page);
  await dashboard(page);
  expect(operations[0]).toBe("ResetDemoData");
  expect([...authorizations]).toEqual(["Bearer demo-token"]);
  expect(allocations).toEqual([]);
  expect(
    await page.evaluate(() =>
      localStorage.getItem("invoice-web-app:demo-session:v1"),
    ),
  ).toBeNull();
  await expect(page.getByTestId("demo-workspace-notice")).toHaveCount(0);
});
