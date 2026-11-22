import { expect, test } from "@playwright/test";

import {
  getContentTestRoutes,
  getNegativeTestRoutes,
} from "../../shared/routes";

const contentRoutes = getContentTestRoutes();

const negativeRoutes = getNegativeTestRoutes(contentRoutes);

function expectSecurityHeaders(headers: Record<string, string>) {
  expect(headers["x-content-type-options"]).toBe("nosniff");

  expect(headers["x-frame-options"]).toBe("DENY");

  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");

  const permissionsPolicy = headers["permissions-policy"];

  expect(permissionsPolicy).toBeDefined();

  for (const permission of ["camera", "microphone", "payment", "usb"]) {
    expect(permissionsPolicy).toContain(`${permission}=()`);
  }

  expect(headers["x-permitted-cross-domain-policies"]).toBe("none");

  expect(headers["x-powered-by"]).toBeUndefined();
}

test.describe("HTTP security @security", () => {
  test.describe("Published content", () => {
    for (const route of contentRoutes) {
      test.describe(route.pathname, () => {
        test("prevents MIME type sniffing", async ({ request }) => {
          const response = await request.get(route.pathname);

          expect(response.status()).toBe(route.expectedStatus);

          expect(response.headers()["x-content-type-options"]).toBe("nosniff");
        });

        test("prevents clickjacking", async ({ request }) => {
          const response = await request.get(route.pathname);

          expect(response.status()).toBe(route.expectedStatus);

          expect(response.headers()["x-frame-options"]).toBe("DENY");
        });

        test("restricts referrer information", async ({ request }) => {
          const response = await request.get(route.pathname);

          expect(response.status()).toBe(route.expectedStatus);

          expect(response.headers()["referrer-policy"]).toBe(
            "strict-origin-when-cross-origin",
          );
        });

        test("restricts browser permissions", async ({ request }) => {
          const response = await request.get(route.pathname);

          expect(response.status()).toBe(route.expectedStatus);

          const policy = response.headers()["permissions-policy"];

          expect(policy).toBeDefined();

          for (const permission of ["camera", "microphone", "payment", "usb"]) {
            expect(policy).toContain(`${permission}=()`);
          }
        });

        test("restricts legacy cross-domain policies", async ({ request }) => {
          const response = await request.get(route.pathname);

          expect(response.status()).toBe(route.expectedStatus);

          expect(response.headers()["x-permitted-cross-domain-policies"]).toBe(
            "none",
          );
        });

        test("does not expose the framework header", async ({ request }) => {
          const response = await request.get(route.pathname);

          expect(response.status()).toBe(route.expectedStatus);

          expect(response.headers()["x-powered-by"]).toBeUndefined();
        });
      });
    }
  });

  test.describe("Unknown routes", () => {
    for (const route of negativeRoutes) {
      test.describe(route.pathname, () => {
        test("preserves security headers on error responses", async ({
          request,
        }) => {
          const response = await request.get(route.pathname);

          expect(response.status()).toBe(route.expectedStatus);

          expectSecurityHeaders(response.headers());
        });

        test("does not expose stack traces on unknown routes", async ({
          request,
        }) => {
          const response = await request.get(route.pathname);

          expect(response.status()).toBe(route.expectedStatus);

          const body = await response.text();

          expect(body).not.toContain("Internal Server Error");

          expect(body).not.toMatch(/Error:\s+.*\n\s+at\s+/);
        });
      });
    }
  });
});
