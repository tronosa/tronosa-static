import { expect, test } from "@playwright/test";

import type { Locator } from "@playwright/test";

type CurrentValue = "page" | "location";

interface NavigationScenario {
  pathname: string;
  label: string;
  current: CurrentValue;
}

const navigationScenarios: NavigationScenario[] = [
  {
    pathname: "/",
    label: "Почетна",
    current: "page",
  },
  {
    pathname: "/o-nama",
    label: "О нама",
    current: "page",
  },
  {
    pathname: "/proizvodi",
    label: "Производи",
    current: "page",
  },
  {
    pathname: "/blog",
    label: "Блог",
    current: "page",
  },
  {
    pathname: "/blog/prirodno-poreklo",
    label: "Блог",
    current: "location",
  },
  {
    pathname: "/sr-Latn",
    label: "Početna",
    current: "page",
  },
  {
    pathname: "/sr-Latn/o-nama",
    label: "O nama",
    current: "page",
  },
  {
    pathname: "/sr-Latn/proizvodi",
    label: "Proizvodi",
    current: "page",
  },
  {
    pathname: "/sr-Latn/blog",
    label: "Blog",
    current: "page",
  },
  {
    pathname: "/en",
    label: "Home",
    current: "page",
  },
  {
    pathname: "/en/about-us",
    label: "About us",
    current: "page",
  },
  {
    pathname: "/en/products",
    label: "Products",
    current: "page",
  },
  {
    pathname: "/en/blog",
    label: "Blog",
    current: "page",
  },
];

const unknownRoutes = [
  "/unknown-page-123456",
  "/sr-Latn/unknown-page-123456",
  "/en/unknown-page-123456",
  "/blog/unknown-article-123456",
  "/sr-Latn/blog/unknown-article-123456",
  "/en/blog/unknown-article-123456",
];

async function expectCurrentNavigation(
  navigation: Locator,
  label: string,
  current: CurrentValue,
) {
  await expect(navigation).toHaveCount(1);

  const activeLinks = navigation.locator("a[aria-current]");

  await expect(activeLinks).toHaveCount(1);

  const activeLink = navigation.getByRole("link", {
    name: label,
    exact: true,
  });

  await expect(activeLink).toHaveAttribute("aria-current", current);

  const inactiveLinks = navigation.locator("a:not([aria-current])");

  const totalLinks = await navigation.getByRole("link").count();

  await expect(inactiveLinks).toHaveCount(totalLinks - 1);
}

test.describe("Navigation accessibility @a11y", () => {
  test.describe("Desktop navigation", () => {
    test.use({
      viewport: {
        width: 1440,
        height: 900,
      },
    });

    for (const { pathname, label, current } of navigationScenarios) {
      test(`identifies current navigation on ${pathname}`, async ({ page }) => {
        const response = await page.goto(pathname);

        expect(response?.status()).toBe(200);

        const navigation = page
          .locator("[data-site-header]")
          .getByRole("navigation");

        await expectCurrentNavigation(navigation, label, current);
      });
    }

    for (const pathname of unknownRoutes) {
      test(`does not activate navigation on ${pathname}`, async ({ page }) => {
        const response = await page.goto(pathname);

        expect(response?.status()).toBe(404);

        const navigation = page
          .locator("[data-site-header]")
          .getByRole("navigation");

        await expect(navigation).toHaveCount(1);

        await expect(navigation.locator("a[aria-current]")).toHaveCount(0);
      });
    }

    test("updates the current link after client-side navigation", async ({
      page,
    }) => {
      await page.goto("/en");

      const navigation = page
        .locator("[data-site-header]")
        .getByRole("navigation");

      await expectCurrentNavigation(navigation, "Home", "page");

      await navigation
        .getByRole("link", {
          name: "About us",
          exact: true,
        })
        .click();

      await expect(page).toHaveURL("/en/about-us");

      await expectCurrentNavigation(navigation, "About us", "page");

      await navigation
        .getByRole("link", {
          name: "Blog",
          exact: true,
        })
        .click();

      await expect(page).toHaveURL("/en/blog");

      await expectCurrentNavigation(navigation, "Blog", "page");
    });

    test("updates the current link after browser back navigation", async ({
      page,
    }) => {
      await page.goto("/en");

      const navigation = page
        .locator("[data-site-header]")
        .getByRole("navigation");

      await navigation
        .getByRole("link", {
          name: "Products",
          exact: true,
        })
        .click();

      await expect(page).toHaveURL("/en/products");

      await expectCurrentNavigation(navigation, "Products", "page");

      await page.goBack();

      await expect(page).toHaveURL("/en");

      await expectCurrentNavigation(navigation, "Home", "page");
    });

    test("preserves active navigation with query parameters", async ({
      page,
    }) => {
      await page.goto("/en/products?source=test");

      const navigation = page
        .locator("[data-site-header]")
        .getByRole("navigation");

      await expectCurrentNavigation(navigation, "Products", "page");
    });

    test("preserves active navigation with a URL fragment", async ({
      page,
    }) => {
      await page.goto("/en/products#main-content");

      const navigation = page
        .locator("[data-site-header]")
        .getByRole("navigation");

      await expectCurrentNavigation(navigation, "Products", "page");
    });
  });

  test.describe("Mobile navigation", () => {
    test.use({
      viewport: {
        width: 390,
        height: 844,
      },
      isMobile: true,
      hasTouch: true,
    });

    const mobileScenarios = [
      {
        pathname: "/",
        openLabel: "Отвори мени",
        label: "Почетна",
        current: "page",
      },
      {
        pathname: "/sr-Latn/proizvodi",
        openLabel: "Otvori meni",
        label: "Proizvodi",
        current: "page",
      },
      {
        pathname: "/en/about-us",
        openLabel: "Open menu",
        label: "About us",
        current: "page",
      },
      {
        pathname: "/blog/prirodno-poreklo",
        openLabel: "Отвори мени",
        label: "Блог",
        current: "location",
      },
    ] as const;

    for (const { pathname, openLabel, label, current } of mobileScenarios) {
      test(`identifies current mobile navigation on ${pathname}`, async ({
        page,
      }) => {
        const response = await page.goto(pathname);

        expect(response?.status()).toBe(200);

        await page
          .getByRole("button", {
            name: openLabel,
            exact: true,
          })
          .click();

        const dialog = page.getByRole("dialog");

        await expect(dialog).toBeVisible();

        const navigation = dialog.getByRole("navigation");

        await expectCurrentNavigation(navigation, label, current);
      });
    }

    test("updates mobile navigation after selecting another page", async ({
      page,
    }) => {
      await page.goto("/en");

      const openMenu = page.getByRole("button", {
        name: "Open menu",
        exact: true,
      });

      await openMenu.click();

      const dialog = page.getByRole("dialog");
      const navigation = dialog.getByRole("navigation");

      await expectCurrentNavigation(navigation, "Home", "page");

      await navigation
        .getByRole("link", {
          name: "Products",
          exact: true,
        })
        .click();

      await expect(page).toHaveURL("/en/products");

      await expect(dialog).not.toBeVisible();

      await openMenu.click();

      await expect(dialog).toBeVisible();

      await expectCurrentNavigation(navigation, "Products", "page");
    });

    test("does not activate mobile navigation on an unknown page", async ({
      page,
    }) => {
      const response = await page.goto("/en/unknown-page-123456");

      expect(response?.status()).toBe(404);

      await page
        .getByRole("button", {
          name: "Open menu",
          exact: true,
        })
        .click();

      const navigation = page.getByRole("dialog").getByRole("navigation");

      await expect(navigation).toHaveCount(1);

      await expect(navigation.locator("a[aria-current]")).toHaveCount(0);
    });
  });

  test.describe("Server-rendered navigation", () => {
    test.use({
      javaScriptEnabled: false,
      viewport: {
        width: 1440,
        height: 900,
      },
    });

    for (const { pathname, label, current } of navigationScenarios) {
      test(`preserves current navigation without JavaScript on ${pathname}`, async ({
        page,
      }) => {
        const response = await page.goto(pathname);

        expect(response?.status()).toBe(200);

        const navigation = page
          .locator("[data-site-header]")
          .getByRole("navigation");

        await expectCurrentNavigation(navigation, label, current);
      });
    }
  });
});
