import { expect, test } from "@playwright/test";

const HOME_ROUTES = ["/", "/sr-Latn", "/en"] as const;

test.describe("Footer navigation @footer @a11y", () => {
  for (const pathname of HOME_ROUTES) {
    test.describe(pathname, () => {
      test.beforeEach(async ({ page }) => {
        await page.emulateMedia({
          reducedMotion: "reduce",
        });
      });

      test("renders desktop navigation links", async ({ page }) => {
        await page.setViewportSize({
          width: 1440,
          height: 1000,
        });

        const response = await page.goto(pathname);

        expect(response?.ok()).toBe(true);

        const navigation = page.locator("footer [data-footer-navigation]");

        await expect(navigation).toBeVisible();

        await expect(navigation).toHaveAccessibleName(/\S/);

        const groups = navigation.locator("[data-footer-group]");

        expect(await groups.count()).toBeGreaterThan(0);

        await expect(navigation.getByRole("button")).toHaveCount(0);

        const links = navigation.locator("a[href]");

        expect(await links.count()).toBeGreaterThan(0);

        for (const link of await links.all()) {
          await expect(link).toBeVisible();
          await expect(link).toHaveAccessibleName(/\S/);
        }
      });

      test("includes the localized homepage link", async ({ page }) => {
        await page.setViewportSize({
          width: 1440,
          height: 1000,
        });

        await page.goto(pathname);

        const company = page.locator('footer [data-footer-group="company"]');

        await expect(company).toBeVisible();

        const firstLink = company.getByRole("link").first();

        await expect(firstLink).toHaveAttribute("href", pathname);
      });

      test("does not duplicate navigation destinations", async ({ page }) => {
        await page.goto(pathname);

        const links = page.locator("footer [data-footer-navigation] a[href]");

        const hrefs = await links.evaluateAll((elements) =>
          elements.map((element) => element.getAttribute("href")),
        );

        expect(hrefs.length).toBeGreaterThan(0);

        expect(new Set(hrefs).size).toBe(hrefs.length);
      });

      test("renders collapsed mobile accordion groups", async ({ page }) => {
        await page.setViewportSize({
          width: 390,
          height: 844,
        });

        await page.goto(pathname);

        const navigation = page.locator("footer [data-footer-navigation]");

        await expect(navigation).toBeVisible();

        const triggers = navigation.getByRole("button");

        expect(await triggers.count()).toBeGreaterThan(0);

        for (const trigger of await triggers.all()) {
          await expect(trigger).toBeVisible();

          await expect(trigger).toHaveAccessibleName(/\S/);

          await expect(trigger).toHaveAttribute("aria-expanded", "false");
        }

        await expect(navigation.getByRole("link")).toHaveCount(0);
      });

      test("opens and closes mobile navigation groups", async ({ page }) => {
        await page.setViewportSize({
          width: 390,
          height: 844,
        });

        await page.goto(pathname);

        const group = page.locator('footer [data-footer-group="company"]');

        const trigger = group.getByRole("button");

        await trigger.click();

        await expect(trigger).toHaveAttribute("aria-expanded", "true");

        await expect(trigger).toHaveAttribute("aria-controls", /\S/);

        const contentId = await trigger.getAttribute("aria-controls");

        expect(contentId).toBeTruthy();

        const controlledContent = group.locator("[id]").filter({
          visible: true,
        });

        const controlledIds = await controlledContent.evaluateAll((elements) =>
          elements.map((element) => element.id),
        );

        expect(controlledIds).toContain(contentId);

        const links = group.getByRole("link");

        expect(await links.count()).toBeGreaterThan(0);

        for (const link of await links.all()) {
          await expect(link).toBeVisible();
        }

        await trigger.click();

        await expect(trigger).toHaveAttribute("aria-expanded", "false");

        await expect(group.getByRole("link")).toHaveCount(0);
      });

      test("supports multiple expanded groups", async ({ page }) => {
        await page.setViewportSize({
          width: 390,
          height: 844,
        });

        await page.goto(pathname);

        const navigation = page.locator("footer [data-footer-navigation]");

        const triggers = navigation.getByRole("button");

        expect(await triggers.count()).toBeGreaterThanOrEqual(2);

        await triggers.nth(0).click();
        await triggers.nth(1).click();

        await expect(
          navigation.locator('button[aria-expanded="true"]'),
        ).toHaveCount(2);
      });

      test("supports keyboard navigation", async ({ page }) => {
        await page.setViewportSize({
          width: 390,
          height: 844,
        });

        await page.goto(pathname);

        const navigation = page.locator("footer [data-footer-navigation]");

        const triggers = navigation.getByRole("button");

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

      test("excludes collapsed links from keyboard navigation", async ({
        page,
      }) => {
        await page.setViewportSize({
          width: 390,
          height: 844,
        });

        await page.goto(pathname);

        const navigation = page.locator("footer [data-footer-navigation]");

        const triggers = navigation.getByRole("button");

        await triggers.first().focus();

        await page.keyboard.press("Tab");

        await expect(triggers.nth(1)).toBeFocused();
      });

      test("preserves navigation when resizing to desktop", async ({
        page,
      }) => {
        await page.setViewportSize({
          width: 390,
          height: 844,
        });

        await page.goto(pathname);

        const navigation = page.locator("footer [data-footer-navigation]");

        await expect(navigation.getByRole("link")).toHaveCount(0);

        await page.setViewportSize({
          width: 1440,
          height: 1000,
        });

        const links = navigation.locator("a[href]");

        for (const link of await links.all()) {
          await expect(link).toBeVisible();
        }

        await expect(navigation.getByRole("button")).toHaveCount(0);

        await page.setViewportSize({
          width: 390,
          height: 844,
        });

        await expect(navigation.getByRole("button").first()).toBeVisible();

        await expect(navigation.getByRole("link")).toHaveCount(0);
      });

      for (const width of [320, 390, 768, 1024, 1440]) {
        test(`has no footer overflow at ${width}px`, async ({ page }) => {
          await page.setViewportSize({
            width,
            height: 900,
          });

          await page.goto(pathname);

          const navigation = page.locator("footer [data-footer-navigation]");

          await expect(navigation).toBeVisible();

          const hasOverflow = await navigation.evaluate(
            (element) => element.scrollWidth > element.clientWidth + 1,
          );

          expect(hasOverflow).toBe(false);
        });
      }

      test("keeps navigation links in server-rendered HTML", async ({
        page,
      }) => {
        await page.setViewportSize({
          width: 390,
          height: 844,
        });

        const response = await page.goto(pathname);

        expect(response).not.toBeNull();

        const html = await response!.text();

        expect(html).toContain('data-footer-group="company"');

        expect(html).toContain("tronosa-accordion-content-inner");

        const links = page.locator("footer [data-footer-navigation] a[href]");

        for (const link of await links.all()) {
          const href = await link.getAttribute("href");

          expect(href).toBeTruthy();

          expect(html).toContain(`href="${href}"`);
        }
      });
    });
  }
});
