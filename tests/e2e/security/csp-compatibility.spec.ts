import { expect, test } from "@playwright/test";

import {
  getContentTestRoutes,
  getNegativeTestRoutes,
} from "../../shared/routes";

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

const contentRoutes = getContentTestRoutes();

const negativeRoutes = getNegativeTestRoutes(contentRoutes);

const routes = [...contentRoutes, ...negativeRoutes];

test.describe("CSP compatibility @security @csp", () => {
  for (const route of routes) {
    test.describe(route.pathname, () => {
      test("loads without CSP violations", async ({ page }) => {
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

        const response = await page.goto(route.pathname);

        expect(response?.status()).toBe(route.expectedStatus);

        await page.waitForLoadState("load");

        await expect(page.locator("main")).toHaveCount(1);

        await expect(page.locator("main")).toBeVisible();

        expect(
          violations,
          JSON.stringify(
            {
              pathname: route.pathname,
              locale: route.locale,
              violations,
            },
            null,
            2,
          ),
        ).toEqual([]);
      });
    });
  }
});
