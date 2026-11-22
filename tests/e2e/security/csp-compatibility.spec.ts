import { expect, test } from "@playwright/test";

interface CspViolation {
  blockedURI: string;
  effectiveDirective: string;
  disposition: string;
  sourceFile: string;
}

declare global {
  interface Window {
    reportCspViolation: (violation: CspViolation) => Promise<void>;
  }
}

const routes = [
  "/",
  "/en",
  "/sr-Latn",
  "/proizvodi",
  "/en/products",
  "/sr-Latn/proizvodi",
  "/o-nama",
  "/en/about-us",
  "/sr-Latn/o-nama",
  "/blog",
  "/en/blog",
  "/sr-Latn/blog",
];

test.describe("CSP compatibility @security @csp", () => {
  for (const route of routes) {
    test(`does not violate CSP on ${route}`, async ({ page }) => {
      const violations: CspViolation[] = [];

      await page.exposeFunction(
        "reportCspViolation",
        (violation: CspViolation) => {
          violations.push(violation);
        },
      );

      await page.addInitScript(() => {
        document.addEventListener("securitypolicyviolation", (event) => {
          void window.reportCspViolation({
            blockedURI: event.blockedURI,
            effectiveDirective: event.effectiveDirective,
            disposition: event.disposition,
            sourceFile: event.sourceFile,
          });
        });
      });

      await page.goto(route);
      await page.waitForLoadState("load");

      expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
    });
  }
});
