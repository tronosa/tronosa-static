import { expect, test } from "@playwright/test";

import type { Page } from "@playwright/test";

const MAIN_CONTENT_ID = "main-content";
const SKIP_LINK_SELECTOR = 'a[href="#main-content"]';

const localizedRoutes = [
  {
    pathname: "/",
    locale: "sr-Cyrl",
    label: "Пређите на главни садржај",
  },
  {
    pathname: "/sr-Latn",
    locale: "sr-Latn",
    label: "Pređite na glavni sadržaj",
  },
  {
    pathname: "/en",
    locale: "en",
    label: "Skip to main content",
  },
] as const;

const contentRoutes = [
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
  "/blog/prirodno-poreklo",
] as const;

async function expectSkipNavigation(page: Page) {
  const skipLink = page.locator(SKIP_LINK_SELECTOR);
  const main = page.locator(`main#${MAIN_CONTENT_ID}`);

  await expect(skipLink).toHaveCount(1);

  await expect(main).toHaveCount(1);

  await expect(main).toHaveAttribute("tabindex", "-1");

  await page.keyboard.press("Tab");

  await expect(skipLink).toBeFocused();

  await expect(skipLink).toBeInViewport();

  const bounds = await skipLink.boundingBox();

  expect(bounds).not.toBeNull();
  expect(bounds?.width ?? 0).toBeGreaterThan(1);
  expect(bounds?.height ?? 0).toBeGreaterThan(1);

  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/#main-content$/);

  await expect(main).toBeFocused();
}

test.describe("Global accessibility @a11y", () => {
  test.describe("Main content landmark", () => {
    for (const pathname of contentRoutes) {
      test(`renders a unique main landmark on ${pathname}`, async ({
        page,
      }) => {
        const response = await page.goto(pathname);

        expect(response?.status()).toBe(200);

        const main = page.getByRole("main");

        await expect(main).toHaveCount(1);

        await expect(page.locator("main")).toHaveCount(1);

        await expect(main).toHaveAttribute("id", MAIN_CONTENT_ID);

        await expect(main).toHaveAttribute("tabindex", "-1");

        await expect(page.locator(`[id="${MAIN_CONTENT_ID}"]`)).toHaveCount(1);

        await expect(page.locator(SKIP_LINK_SELECTOR)).toHaveCount(1);
      });
    }

    test("preserves the semantic article landmark", async ({ page }) => {
      const response = await page.goto("/blog/prirodno-poreklo");

      expect(response?.status()).toBe(200);

      const main = page.getByRole("main");

      await expect(main).toHaveCount(1);

      await expect(main.locator(":scope > article")).toHaveCount(1);
    });
  });

  test.describe("Localized skip navigation", () => {
    for (const { pathname, locale, label } of localizedRoutes) {
      test(`renders the localized skip link for ${locale}`, async ({
        page,
      }) => {
        await page.goto(pathname);

        await expect(page.locator("html")).toHaveAttribute("lang", locale);

        const skipLink = page.locator(SKIP_LINK_SELECTOR);

        await expect(skipLink).toHaveCount(1);

        await expect(skipLink).toHaveAccessibleName(label);
      });

      test(`focuses the skip link first for ${locale}`, async ({ page }) => {
        await page.goto(pathname);

        await page.keyboard.press("Tab");

        await expect(page.locator(SKIP_LINK_SELECTOR)).toBeFocused();
      });

      test(`moves keyboard focus to main content for ${locale}`, async ({
        page,
      }) => {
        await page.goto(pathname);

        await expectSkipNavigation(page);
      });
    }
  });

  test.describe("Skip link visibility", () => {
    test("is visually concealed before receiving focus", async ({ page }) => {
      await page.goto("/");

      const skipLink = page.locator(SKIP_LINK_SELECTOR);

      const bounds = await skipLink.boundingBox();

      expect(bounds).not.toBeNull();
      expect(bounds?.width ?? 0).toBeLessThanOrEqual(1);
      expect(bounds?.height ?? 0).toBeLessThanOrEqual(1);
    });

    test("becomes visible after receiving keyboard focus", async ({ page }) => {
      await page.goto("/");

      await page.keyboard.press("Tab");

      const skipLink = page.locator(SKIP_LINK_SELECTOR);

      await expect(skipLink).toBeFocused();

      await expect(skipLink).toBeInViewport();

      const bounds = await skipLink.boundingBox();

      expect(bounds).not.toBeNull();
      expect(bounds?.width ?? 0).toBeGreaterThan(1);
      expect(bounds?.height ?? 0).toBeGreaterThan(1);
    });
  });

  test.describe("Content-specific skip navigation", () => {
    for (const pathname of [
      "/o-nama",
      "/proizvodi",
      "/blog",
      "/blog/prirodno-poreklo",
    ]) {
      test(`skips navigation on ${pathname}`, async ({ page }) => {
        const response = await page.goto(pathname);

        expect(response?.status()).toBe(200);

        await expectSkipNavigation(page);
      });
    }
  });

  test.describe("Mobile skip navigation", () => {
    test.use({
      viewport: {
        width: 390,
        height: 844,
      },
      isMobile: true,
      hasTouch: true,
    });

    test("supports keyboard skip navigation on mobile", async ({ page }) => {
      await page.goto("/");

      await expectSkipNavigation(page);
    });
  });

  test.describe("JavaScript-independent navigation", () => {
    test.use({
      javaScriptEnabled: false,
    });

    for (const { pathname, locale } of localizedRoutes) {
      test(`supports skip navigation without JavaScript for ${locale}`, async ({
        page,
      }) => {
        await page.goto(pathname);

        await expectSkipNavigation(page);
      });
    }

    test("supports article skip navigation without JavaScript", async ({
      page,
    }) => {
      await page.goto("/blog/prirodno-poreklo");

      await expectSkipNavigation(page);
    });
  });

  test.describe("Not found accessibility", () => {
    const notFoundRoutes = [
      {
        pathname: "/unknown-page-123456",
        description: "Страница није пронађена.",
      },
      {
        pathname: "/sr-Latn/unknown-page-123456",
        description: "Stranica nije pronađena.",
      },
      {
        pathname: "/en/unknown-page-123456",
        description: "Page not found.",
      },
    ] as const;

    for (const { pathname, description } of notFoundRoutes) {
      test(`renders an accessible not found page on ${pathname}`, async ({
        page,
      }) => {
        const response = await page.goto(pathname);

        expect(response?.status()).toBe(404);

        await expect(page.getByRole("main")).toHaveCount(1);

        await expect(
          page.getByRole("heading", {
            level: 1,
            name: "404",
            exact: true,
          }),
        ).toHaveCount(1);

        await expect(
          page.getByRole("main").getByText(description, {
            exact: true,
          }),
        ).toBeVisible();

        await expectSkipNavigation(page);
      });
    }
  });
});
