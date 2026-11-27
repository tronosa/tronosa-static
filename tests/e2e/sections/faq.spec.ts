import { expect, test } from "@playwright/test";

import { getSectionTestRoutes } from "../../shared/routes";

const routes = getSectionTestRoutes("faq");

test.describe("FAQ accordion @faq @a11y", () => {
  for (const route of routes) {
    test.describe(route.pathname, () => {
      test.beforeEach(async ({ page }) => {
        await page.emulateMedia({
          reducedMotion: "reduce",
        });

        const response = await page.goto(route.pathname);

        expect(response?.status()).toBe(route.expectedStatus);
      });

      test("renders accessible accordion triggers", async ({ page }) => {
        const accordion = page.locator("[data-faq-accordion]");

        await expect(accordion).toBeVisible();

        const triggers = accordion.getByRole("button");

        expect(await triggers.count()).toBeGreaterThan(0);

        for (const trigger of await triggers.all()) {
          await expect(trigger).toHaveAccessibleName(/\S/);

          await expect(trigger).toHaveAttribute("aria-expanded", "false");

          await expect(trigger).toHaveAttribute("aria-controls", /\S/);
        }
      });

      test("opens and closes an answer", async ({ page }) => {
        const accordion = page.locator("[data-faq-accordion]");

        const trigger = accordion.getByRole("button").first();

        await trigger.click();

        await expect(trigger).toHaveAttribute("aria-expanded", "true");

        await expect(accordion.getByRole("region")).toHaveCount(1);

        await expect(accordion.getByRole("region")).toBeVisible();

        await trigger.click();

        await expect(trigger).toHaveAttribute("aria-expanded", "false");

        await expect(accordion.getByRole("region")).toHaveCount(0);
      });

      test("allows only one expanded answer", async ({ page }) => {
        const accordion = page.locator("[data-faq-accordion]");

        const triggers = accordion.getByRole("button");

        const count = await triggers.count();

        for (let index = 0; index < count; index++) {
          await triggers.nth(index).click();

          await expect(
            accordion.locator('button[aria-expanded="true"]'),
          ).toHaveCount(1);
        }
      });

      test("supports keyboard interaction", async ({ page }) => {
        const accordion = page.locator("[data-faq-accordion]");

        const triggers = accordion.getByRole("button");

        const first = triggers.first();

        await first.focus();

        await expect(first).toBeFocused();

        await page.keyboard.press("Enter");

        await expect(first).toHaveAttribute("aria-expanded", "true");

        await page.keyboard.press("Space");

        await expect(first).toHaveAttribute("aria-expanded", "false");

        await page.keyboard.press("End");

        await expect(triggers.last()).toBeFocused();

        await page.keyboard.press("Home");

        await expect(first).toBeFocused();
      });

      test("preserves closed answers in server HTML", async ({ request }) => {
        const response = await request.get(route.pathname);

        expect(response.ok()).toBe(true);

        const html = await response.text();

        expect(html).toContain("data-faq-accordion");

        expect(html).toContain("tronosa-accordion-content-inner");
      });

      test("respects reduced motion", async ({ page }) => {
        const accordion = page.locator("[data-faq-accordion]");

        await accordion.getByRole("button").first().click();

        await expect(accordion.getByRole("region")).toHaveCSS(
          "transition-duration",
          "0s",
        );
      });
    });
  }
});
