import { expect, test, type Page } from "@playwright/test";

import { defaultLocale, locales, type Locale } from "@/i18n/config";

import {
  getContentTestRoutes,
  getNegativeTestRoutes,
} from "../../shared/routes";

const MAIN_CONTENT_ID = "main-content";

const SKIP_LINK_SELECTOR = 'a[href="#main-content"]';

const NOT_FOUND_SELECTOR = "[data-not-found-page]";

const NOT_FOUND_HEADING_ID = "not-found-heading";

const contentRoutes = getContentTestRoutes();

const negativeRoutes = getNegativeTestRoutes(contentRoutes);

const articleRoutes = contentRoutes.filter((route) => route.kind === "article");

const SKIP_LINK_LABELS = {
  "sr-Cyrl": "Пређите на главни садржај",
  "sr-Latn": "Pređite na glavni sadržaj",
  en: "Skip to main content",
} as const satisfies Record<Locale, string>;

type NotFoundContent = {
  eyebrow: string;
  title: string;
  description: string;
  navigationLabel: string;
  home: string;
  blog: string;
};

const NOT_FOUND_CONTENT = {
  "sr-Cyrl": {
    eyebrow: "ГРЕШКА 404",
    title: "Страница није пронађена.",
    description:
      "Изгледа да страница коју тражите не постоји или је променила адресу. Вратите се на почетну или истражите наше приче.",
    navigationLabel: "Навигација са странице која није пронађена",
    home: "Назад на почетну",
    blog: "Истражите приче",
  },
  "sr-Latn": {
    eyebrow: "GREŠKA 404",
    title: "Stranica nije pronađena.",
    description:
      "Izgleda da stranica koju tražite ne postoji ili je promenila adresu. Vratite se na početnu ili istražite naše priče.",
    navigationLabel: "Navigacija sa stranice koja nije pronađena",
    home: "Nazad na početnu",
    blog: "Istražite priče",
  },
  en: {
    eyebrow: "ERROR 404",
    title: "Page not found.",
    description:
      "The page you're looking for doesn't exist or has moved. Return to the homepage or explore our stories.",
    navigationLabel: "Page not found navigation",
    home: "Back to homepage",
    blog: "Explore our stories",
  },
} as const satisfies Record<Locale, NotFoundContent>;

const localizedRoutes = locales.map((locale) => {
  const route = contentRoutes.find(
    (entry) =>
      entry.kind === "page" && entry.id === "home" && entry.locale === locale,
  );

  if (!route) {
    throw new Error(`Home route is missing for locale "${locale}".`);
  }

  return {
    ...route,
    label: SKIP_LINK_LABELS[locale],
  };
});

const defaultHomeRoute = localizedRoutes.find(
  (route) => route.locale === defaultLocale,
);

if (!defaultHomeRoute) {
  throw new Error("Default locale home route is missing.");
}

const defaultHomePathname = defaultHomeRoute.pathname;

const nonHomeRoutes = contentRoutes.filter(
  (route) => route.kind !== "page" || route.id !== "home",
);

async function navigateToRoute(
  page: Page,
  pathname: string,
  expectedStatus: number = 200,
) {
  const response = await page.goto(pathname);

  expect(response?.status()).toBe(expectedStatus);
}

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
    for (const route of contentRoutes) {
      test(`renders a unique main landmark on ${route.pathname}`, async ({
        page,
      }) => {
        await navigateToRoute(page, route.pathname, route.expectedStatus);

        const main = page.getByRole("main");

        await expect(main).toHaveCount(1);

        await expect(page.locator("main")).toHaveCount(1);

        await expect(main).toHaveAttribute("id", MAIN_CONTENT_ID);

        await expect(main).toHaveAttribute("tabindex", "-1");

        await expect(page.locator(`[id="${MAIN_CONTENT_ID}"]`)).toHaveCount(1);

        await expect(page.locator(SKIP_LINK_SELECTOR)).toHaveCount(1);
      });
    }

    for (const route of articleRoutes) {
      test(`preserves the semantic article landmark on ${route.pathname}`, async ({
        page,
      }) => {
        await navigateToRoute(page, route.pathname, route.expectedStatus);

        const main = page.getByRole("main");

        await expect(main).toHaveCount(1);

        await expect(main.locator(":scope > article")).toHaveCount(1);
      });
    }
  });

  test.describe("Localized skip navigation", () => {
    for (const route of localizedRoutes) {
      test(`renders the localized skip link for ${route.locale}`, async ({
        page,
      }) => {
        await navigateToRoute(page, route.pathname, route.expectedStatus);

        await expect(page.locator("html")).toHaveAttribute(
          "lang",
          route.locale,
        );

        const skipLink = page.locator(SKIP_LINK_SELECTOR);

        await expect(skipLink).toHaveCount(1);

        await expect(skipLink).toHaveAccessibleName(route.label);
      });

      test(`focuses the skip link first for ${route.locale}`, async ({
        page,
      }) => {
        await navigateToRoute(page, route.pathname, route.expectedStatus);

        await page.keyboard.press("Tab");

        await expect(page.locator(SKIP_LINK_SELECTOR)).toBeFocused();
      });

      test(`moves keyboard focus to main content for ${route.locale}`, async ({
        page,
      }) => {
        await navigateToRoute(page, route.pathname, route.expectedStatus);

        await expectSkipNavigation(page);
      });
    }
  });

  test.describe("Skip link visibility", () => {
    test("is visually concealed before receiving focus", async ({ page }) => {
      await navigateToRoute(page, defaultHomePathname);

      const skipLink = page.locator(SKIP_LINK_SELECTOR);

      const bounds = await skipLink.boundingBox();

      expect(bounds).not.toBeNull();

      expect(bounds?.width ?? 0).toBeLessThanOrEqual(1);

      expect(bounds?.height ?? 0).toBeLessThanOrEqual(1);
    });

    test("becomes visible after receiving keyboard focus", async ({ page }) => {
      await navigateToRoute(page, defaultHomePathname);

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
    for (const route of nonHomeRoutes) {
      test(`skips navigation on ${route.pathname}`, async ({ page }) => {
        await navigateToRoute(page, route.pathname, route.expectedStatus);

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

    for (const route of localizedRoutes) {
      test(`supports keyboard skip navigation on mobile for ${route.locale}`, async ({
        page,
      }) => {
        await navigateToRoute(page, route.pathname, route.expectedStatus);

        await expectSkipNavigation(page);
      });
    }
  });

  test.describe("JavaScript-independent navigation", () => {
    test.use({
      javaScriptEnabled: false,
    });

    for (const route of contentRoutes) {
      test(`supports skip navigation without JavaScript on ${route.pathname}`, async ({
        page,
      }) => {
        await navigateToRoute(page, route.pathname, route.expectedStatus);

        await expectSkipNavigation(page);
      });
    }
  });

  test.describe("Not found accessibility", () => {
    for (const route of negativeRoutes) {
      const content = NOT_FOUND_CONTENT[route.locale];

      const homeRoute = contentRoutes.find(
        (entry) =>
          entry.kind === "page" &&
          entry.id === "home" &&
          entry.locale === route.locale,
      );

      const blogRoute = contentRoutes.find(
        (entry) =>
          entry.kind === "page" &&
          entry.id === "blog" &&
          entry.locale === route.locale,
      );

      test(`renders an accessible not found page on ${route.pathname}`, async ({
        page,
      }) => {
        await navigateToRoute(page, route.pathname, route.expectedStatus);

        await expect(page.locator("html")).toHaveAttribute(
          "lang",
          route.locale,
        );

        const main = page.getByRole("main");

        await expect(main).toHaveCount(1);

        const notFound = main.locator(NOT_FOUND_SELECTOR);

        await expect(notFound).toHaveCount(1);

        await expect(notFound).toBeVisible();

        await expect(notFound).toHaveAttribute(
          "aria-labelledby",
          NOT_FOUND_HEADING_ID,
        );

        await expect(notFound).toHaveAccessibleName(content.title);

        const heading = notFound.getByRole("heading", {
          level: 1,
          name: content.title,
          exact: true,
        });

        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

        await expect(heading).toHaveCount(1);

        await expect(heading).toBeVisible();

        await expect(heading).toHaveAttribute("id", NOT_FOUND_HEADING_ID);

        await expect(
          page.locator(`[id="${NOT_FOUND_HEADING_ID}"]`),
        ).toHaveCount(1);

        const errorCode = notFound
          .locator('span[aria-hidden="true"]')
          .filter({ hasText: /^404$/ });

        await expect(errorCode).toHaveCount(1);

        await expect(errorCode).toBeVisible();

        await expect(
          notFound.getByRole("heading", {
            name: "404",
            exact: true,
          }),
        ).toHaveCount(0);

        await expect(
          notFound.getByText(content.eyebrow, {
            exact: true,
          }),
        ).toBeVisible();

        await expect(
          notFound.getByText(content.description, {
            exact: true,
          }),
        ).toBeVisible();

        const navigation = notFound.getByRole("navigation", {
          name: content.navigationLabel,
          exact: true,
        });

        if (homeRoute || blogRoute) {
          await expect(navigation).toHaveCount(1);

          await expect(navigation).toBeVisible();
        } else {
          await expect(navigation).toHaveCount(0);
        }

        if (homeRoute) {
          const homeLink = navigation.getByRole("link", {
            name: content.home,
            exact: true,
          });

          await expect(homeLink).toHaveCount(1);

          await expect(homeLink).toBeVisible();

          const href = await homeLink.getAttribute("href");

          expect(href).not.toBeNull();

          expect(
            new URL(href!, page.url()).pathname.replace(/\/+$/, "") || "/",
          ).toBe(homeRoute.pathname.replace(/\/+$/, "") || "/");
        }

        if (blogRoute) {
          const blogLink = navigation.getByRole("link", {
            name: content.blog,
            exact: true,
          });

          await expect(blogLink).toHaveCount(1);

          await expect(blogLink).toBeVisible();

          const href = await blogLink.getAttribute("href");

          expect(href).not.toBeNull();

          expect(
            new URL(href!, page.url()).pathname.replace(/\/+$/, "") || "/",
          ).toBe(blogRoute.pathname.replace(/\/+$/, "") || "/");
        }

        await expectSkipNavigation(page);
      });
    }
  });
});
