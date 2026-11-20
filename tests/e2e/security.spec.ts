import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/en",
  "/sr-Latn",
  "/proizvodi",
  "/en/products",
  "/sr-Latn/proizvodi",
  "/o-nama",
  "/en/about-us",
  "/blog",
  "/en/blog",
];

test.describe("HTTP security @security", () => {
  for (const route of routes) {
    test.describe(route, () => {
      test("prevents MIME type sniffing", async ({ request }) => {
        const response = await request.get(route);

        expect(response.ok()).toBe(true);
        expect(response.headers()["x-content-type-options"]).toBe("nosniff");
      });

      test("prevents clickjacking", async ({ request }) => {
        const response = await request.get(route);

        expect(response.ok()).toBe(true);
        expect(response.headers()["x-frame-options"]).toBe("DENY");
      });

      test("restricts referrer information", async ({ request }) => {
        const response = await request.get(route);

        expect(response.ok()).toBe(true);
        expect(response.headers()["referrer-policy"]).toBe(
          "strict-origin-when-cross-origin",
        );
      });

      test("restricts browser permissions", async ({ request }) => {
        const response = await request.get(route);

        expect(response.ok()).toBe(true);

        const policy = response.headers()["permissions-policy"];

        expect(policy).toBeDefined();

        for (const permission of ["camera", "microphone", "payment", "usb"]) {
          expect(policy).toContain(`${permission}=()`);
        }
      });

      test("restricts legacy cross-domain policies", async ({ request }) => {
        const response = await request.get(route);

        expect(response.ok()).toBe(true);

        expect(response.headers()["x-permitted-cross-domain-policies"]).toBe(
          "none",
        );
      });

      test("does not expose the framework header", async ({ request }) => {
        const response = await request.get(route);

        expect(response.ok()).toBe(true);
        expect(response.headers()["x-powered-by"]).toBeUndefined();
      });
    });
  }

  test("preserves security headers on 404 responses", async ({ request }) => {
    const response = await request.get("/non-existing-security-test");

    expect(response.status()).toBe(404);

    expect(response.headers()["x-content-type-options"]).toBe("nosniff");

    expect(response.headers()["x-frame-options"]).toBe("DENY");
  });

  test("does not expose stack traces on unknown routes", async ({
    request,
  }) => {
    const response = await request.get("/non-existing-security-test");

    expect(response.status()).toBe(404);

    const body = await response.text();

    expect(body).not.toContain("Internal Server Error");
    expect(body).not.toMatch(/Error:\s+.*\n\s+at\s+/);
  });
});
