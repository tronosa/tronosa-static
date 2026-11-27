import { expect, test, type Locator, type Page } from "@playwright/test";

import { locales } from "@/i18n/config";

import { getSectionTestRoutes } from "../../shared/routes";

const routes = getSectionTestRoutes("product-experience");

for (const locale of locales) {
  if (!routes.some((route) => route.locale === locale)) {
    throw new Error(`Product experience is missing for locale "${locale}".`);
  }
}

type ExperienceRoute = (typeof routes)[number];

const DESKTOP_VIEWPORT = {
  width: 1440,
  height: 900,
};

const MOBILE_VIEWPORT = {
  width: 390,
  height: 844,
};

async function navigateToExperience(
  page: Page,
  route: ExperienceRoute,
): Promise<Locator> {
  const response = await page.goto(route.pathname);

  expect(response?.status()).toBe(route.expectedStatus);

  const experience = page.locator("main [data-experience-viewport]");

  await expect(experience).toHaveCount(1);

  return experience;
}

function getDesktop(experience: Locator): Locator {
  return experience.locator("[data-experience-desktop]");
}

function getMobile(experience: Locator): Locator {
  return experience.locator("[data-experience-mobile]");
}

function getProductDetails(experience: Locator): Locator {
  return getDesktop(experience).locator("[data-experience-product-detail]");
}

function getProductNavigation(mobile: Locator): Locator {
  return mobile.locator("button[aria-pressed]");
}

function getMobileHeading(mobile: Locator): Locator {
  return mobile.locator("[data-mobile-active-heading] h2");
}

function getMobileHighlights(mobile: Locator): Locator {
  return mobile.locator("[data-mobile-active-highlight]");
}

async function expectHighlightContent(highlights: Locator): Promise<void> {
  const count = await highlights.count();

  expect(count).toBeGreaterThan(0);

  for (const highlight of await highlights.all()) {
    await expect(highlight.locator("h3")).not.toBeEmpty();

    await expect(highlight.locator("p")).not.toBeEmpty();
  }
}

test.describe("Product experience @products", () => {
  for (const route of routes) {
    test.describe(route.pathname, () => {
      test("renders complete product presentation data", async ({ page }) => {
        await page.setViewportSize(DESKTOP_VIEWPORT);

        const experience = await navigateToExperience(page, route);

        const details = getProductDetails(experience);

        const count = await details.count();

        expect(count).toBeGreaterThan(0);

        const ids = await details.evaluateAll((elements) =>
          elements.map((element) =>
            element.getAttribute("data-experience-product-detail"),
          ),
        );

        expect(ids.every(Boolean)).toBe(true);

        expect(new Set(ids).size).toBe(ids.length);

        for (const detail of await details.all()) {
          await expect(detail.locator("h2")).not.toBeEmpty();

          const highlights = detail.locator("[data-experience-highlight]");

          await expectHighlightContent(highlights);
        }

        await expect(
          experience.locator('button[aria-haspopup="dialog"]'),
        ).toHaveCount(0);
      });

      test("activates desktop animation on supported viewports", async ({
        page,
      }) => {
        await page.setViewportSize(DESKTOP_VIEWPORT);

        await page.emulateMedia({
          reducedMotion: "no-preference",
        });

        const experience = await navigateToExperience(page, route);

        await expect(experience).toHaveAttribute("data-animated", "true", {
          timeout: 15_000,
        });

        await expect(getDesktop(experience)).toBeVisible();

        await expect(getMobile(experience)).toBeHidden();
      });

      test("provides a non-pinned reduced motion experience", async ({
        page,
      }) => {
        await page.setViewportSize(DESKTOP_VIEWPORT);

        await page.emulateMedia({
          reducedMotion: "reduce",
        });

        const experience = await navigateToExperience(page, route);

        await expect(getMobile(experience)).toBeVisible();

        await expect(getDesktop(experience)).toBeHidden();

        await expect(experience).not.toHaveAttribute("data-animated", "true");

        await expect(getMobileHeading(getMobile(experience))).toBeVisible();
      });

      test("renders the mobile experience", async ({ page }) => {
        await page.setViewportSize(MOBILE_VIEWPORT);

        const experience = await navigateToExperience(page, route);

        const mobile = getMobile(experience);

        await expect(mobile).toBeVisible();

        await expect(getDesktop(experience)).toBeHidden();

        await expect(getMobileHeading(mobile)).toBeVisible();

        await expect(
          mobile.locator("[data-mobile-active-bottle] img"),
        ).toHaveCount(1);

        await expectHighlightContent(getMobileHighlights(mobile));

        await expect(
          mobile.locator('button[aria-haspopup="dialog"]'),
        ).toHaveCount(0);
      });

      test("switches mobile products and updates presentation content", async ({
        page,
      }) => {
        await page.setViewportSize(MOBILE_VIEWPORT);

        await page.emulateMedia({
          reducedMotion: "reduce",
        });

        const experience = await navigateToExperience(page, route);

        const mobile = getMobile(experience);

        const desktopProducts = getProductDetails(experience);

        const productCount = await desktopProducts.count();

        expect(productCount).toBeGreaterThan(0);

        const navigation = getProductNavigation(mobile);

        if (productCount === 1) {
          await expect(navigation).toHaveCount(0);

          return;
        }

        await expect(navigation).toHaveCount(productCount);

        await expect(navigation.first()).toHaveAttribute(
          "aria-pressed",
          "true",
        );

        for (let index = 0; index < productCount; index++) {
          const button = navigation.nth(index);

          await button.click();

          await expect(button).toHaveAttribute("aria-pressed", "true");

          await expect(
            mobile.locator('button[aria-pressed="true"]'),
          ).toHaveCount(1);

          const expectedTitle = await desktopProducts
            .nth(index)
            .locator("h2")
            .textContent();

          await expect(getMobileHeading(mobile)).toHaveText(
            expectedTitle ?? "",
          );

          const desktopHighlights = desktopProducts
            .nth(index)
            .locator("[data-experience-highlight]");

          const mobileHighlights = getMobileHighlights(mobile);

          await expect(mobileHighlights).toHaveCount(
            await desktopHighlights.count(),
          );

          expect(
            await mobileHighlights.locator("h3").allTextContents(),
          ).toEqual(await desktopHighlights.locator("h3").allTextContents());

          expect(await mobileHighlights.locator("p").allTextContents()).toEqual(
            await desktopHighlights.locator("p").allTextContents(),
          );
        }
      });

      test("supports keyboard product selection on mobile", async ({
        page,
      }) => {
        await page.setViewportSize(MOBILE_VIEWPORT);

        await page.emulateMedia({
          reducedMotion: "reduce",
        });

        const experience = await navigateToExperience(page, route);

        const mobile = getMobile(experience);

        const navigation = getProductNavigation(mobile);

        const count = await navigation.count();

        test.skip(count < 2, "Product switching requires multiple products.");

        const first = navigation.nth(0);

        const second = navigation.nth(1);

        await first.focus();

        await expect(first).toBeFocused();

        await page.keyboard.press("Tab");

        await expect(second).toBeFocused();

        await page.keyboard.press("Enter");

        await expect(second).toHaveAttribute("aria-pressed", "true");

        await expect(first).toHaveAttribute("aria-pressed", "false");

        await expect(second).toBeFocused();
      });

      test("switches to mobile layout after viewport resize", async ({
        page,
      }) => {
        await page.setViewportSize(DESKTOP_VIEWPORT);

        await page.emulateMedia({
          reducedMotion: "no-preference",
        });

        const experience = await navigateToExperience(page, route);

        await expect(experience).toHaveAttribute("data-animated", "true", {
          timeout: 15_000,
        });

        await page.setViewportSize(MOBILE_VIEWPORT);

        await expect(getMobile(experience)).toBeVisible();

        await expect(getDesktop(experience)).toBeHidden();

        await expect(experience).not.toHaveAttribute("data-animated", "true");

        await expect(getMobileHeading(getMobile(experience))).toBeVisible();
      });

      test("remains usable on short desktop viewports", async ({ page }) => {
        await page.setViewportSize({
          width: 1440,
          height: 700,
        });

        const experience = await navigateToExperience(page, route);

        await expect(getMobile(experience)).toBeVisible();

        await expect(getDesktop(experience)).toBeHidden();

        await expect(getMobileHeading(getMobile(experience))).toBeVisible();

        await expectHighlightContent(
          getMobileHighlights(getMobile(experience)),
        );
      });

      test("does not produce runtime animation errors", async ({ page }) => {
        const errors: string[] = [];

        page.on("pageerror", (error) => {
          errors.push(error.message);
        });

        page.on("console", (message) => {
          if (
            message.type() === "error" &&
            /ProductExperience/.test(message.text())
          ) {
            errors.push(message.text());
          }
        });

        await page.setViewportSize(DESKTOP_VIEWPORT);

        await page.emulateMedia({
          reducedMotion: "no-preference",
        });

        const experience = await navigateToExperience(page, route);

        await expect(experience).toHaveAttribute("data-animated", "true", {
          timeout: 15_000,
        });

        await page.setViewportSize(MOBILE_VIEWPORT);

        const mobile = getMobile(experience);

        await expect(mobile).toBeVisible();

        const navigation = getProductNavigation(mobile);

        if ((await navigation.count()) > 1) {
          await navigation.nth(1).click();

          await expect(navigation.nth(1)).toHaveAttribute(
            "aria-pressed",
            "true",
          );
        }

        await page.setViewportSize(DESKTOP_VIEWPORT);

        await expect(experience).toHaveAttribute("data-animated", "true", {
          timeout: 15_000,
        });

        expect(errors).toEqual([]);
      });
    });
  }
});
