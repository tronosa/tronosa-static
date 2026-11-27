import { expect, test } from "@playwright/test";

import { getSectionTestRoutes } from "../../shared/routes";

const routes = getSectionTestRoutes("text-hero");

test.describe("Text hero @text-hero", () => {
  for (const route of routes) {
    test.describe(route.pathname, () => {
      test("renders a single accessible page heading", async ({ page }) => {
        const response = await page.goto(route.pathname);

        expect(response?.status()).toBe(route.expectedStatus);

        const hero = page.locator("main [data-text-hero]");

        await expect(hero).toHaveCount(1);
        await expect(hero).toBeVisible();

        const heading = hero.getByRole("heading", {
          level: 1,
        });

        await expect(heading).toHaveCount(1);
        await expect(heading).toBeVisible();
        await expect(heading).not.toBeEmpty();

        await expect(page.locator("main h1")).toHaveCount(1);
      });

      test("does not render unnecessary media", async ({ page }) => {
        await page.goto(route.pathname);

        const hero = page.locator("main [data-text-hero]");

        await expect(hero).toBeVisible();

        await expect(hero.locator("img, picture, video, iframe")).toHaveCount(
          0,
        );
      });

      test("renders correctly on mobile", async ({ page }) => {
        await page.setViewportSize({
          width: 390,
          height: 844,
        });

        await page.goto(route.pathname);

        const hero = page.locator("main [data-text-hero]");

        await expect(hero).toBeVisible();

        await expect(hero.getByRole("heading", { level: 1 })).toBeVisible();

        const hasOverflow = await hero.evaluate(
          (element) => element.scrollWidth > element.clientWidth + 1,
        );

        expect(hasOverflow).toBe(false);
      });
    });
  }
});
