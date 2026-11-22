import { expect, test, type Locator, type Page } from "@playwright/test";

import type { Locale } from "@/i18n/config";

import {
  getContentTestRoutes,
  getNegativeTestRoutes,
} from "../../shared/routes";

type CurrentValue = "page" | "location";

type NavigationPageId = "home" | "about" | "products" | "blog" | "contact";

type NavigationExpectation = {
  label: string;
  current: CurrentValue;
} | null;

const NAVIGATION_LABELS = {
  "sr-Cyrl": {
    home: "Почетна",
    about: "О нама",
    products: "Производи",
    blog: "Блог",
    contact: "Контакт",
  },
  "sr-Latn": {
    home: "Početna",
    about: "O nama",
    products: "Proizvodi",
    blog: "Blog",
    contact: "Kontakt",
  },
  en: {
    home: "Home",
    about: "About us",
    products: "Products",
    blog: "Blog",
    contact: "Contact",
  },
} as const satisfies Record<Locale, Record<NavigationPageId, string>>;

const MOBILE_MENU_LABELS = {
  "sr-Cyrl": "Отвори мени",
  "sr-Latn": "Otvori meni",
  en: "Open menu",
} as const satisfies Record<Locale, string>;

const contentRoutes = getContentTestRoutes();

const negativeRoutes = getNegativeTestRoutes(contentRoutes);

type ContentRoute = (typeof contentRoutes)[number];

function isNavigationPageId(id: string): id is NavigationPageId {
  return Object.hasOwn(NAVIGATION_LABELS.en, id);
}

function getExpectedNavigation(route: ContentRoute): NavigationExpectation {
  const labels = NAVIGATION_LABELS[route.locale];

  if (route.kind === "article") {
    return {
      label: labels.blog,
      current: "location",
    };
  }

  if (!isNavigationPageId(route.id)) {
    return null;
  }

  return {
    label: labels[route.id],
    current: "page",
  };
}

const navigationScenarios = contentRoutes.map((route) => ({
  ...route,
  navigation: getExpectedNavigation(route),
}));

function getRequiredPageRoute(
  id: NavigationPageId,
  locale: Locale,
): ContentRoute {
  const route = contentRoutes.find(
    (entry) =>
      entry.kind === "page" && entry.id === id && entry.locale === locale,
  );

  if (!route) {
    throw new Error(`Missing navigation page "${id}" for locale "${locale}".`);
  }

  return route;
}

const englishHome = getRequiredPageRoute("home", "en");

const englishAbout = getRequiredPageRoute("about", "en");

const englishProducts = getRequiredPageRoute("products", "en");

const englishBlog = getRequiredPageRoute("blog", "en");

async function navigateToRoute(
  page: Page,
  pathname: string,
  expectedStatus = 200,
) {
  const response = await page.goto(pathname);

  expect(response?.status()).toBe(expectedStatus);
}

function getDesktopNavigation(page: Page): Locator {
  return page.locator("[data-site-header]").getByRole("navigation");
}

async function openMobileNavigation(
  page: Page,
  locale: Locale,
): Promise<Locator> {
  await page
    .getByRole("button", {
      name: MOBILE_MENU_LABELS[locale],
      exact: true,
    })
    .click();

  const dialog = page.getByRole("dialog");

  await expect(dialog).toBeVisible();

  return dialog.getByRole("navigation");
}

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

  await expect(activeLink).toHaveCount(1);

  await expect(activeLink).toHaveAttribute("aria-current", current);

  const inactiveLinks = navigation.locator("a:not([aria-current])");

  const totalLinks = await navigation.getByRole("link").count();

  await expect(inactiveLinks).toHaveCount(totalLinks - 1);
}

async function expectNoCurrentNavigation(navigation: Locator) {
  await expect(navigation).toHaveCount(1);

  await expect(navigation.getByRole("link").first()).toBeVisible();

  await expect(navigation.locator("a[aria-current]")).toHaveCount(0);
}

async function expectNavigationState(
  navigation: Locator,
  expectation: NavigationExpectation,
) {
  if (!expectation) {
    await expectNoCurrentNavigation(navigation);

    return;
  }

  await expectCurrentNavigation(
    navigation,
    expectation.label,
    expectation.current,
  );
}

test.describe("Navigation accessibility @a11y", () => {
  test.describe("Desktop navigation", () => {
    test.use({
      viewport: {
        width: 1440,
        height: 900,
      },
    });

    for (const scenario of navigationScenarios) {
      test(`identifies current navigation on ${scenario.pathname}`, async ({
        page,
      }) => {
        await navigateToRoute(page, scenario.pathname, scenario.expectedStatus);

        const navigation = getDesktopNavigation(page);

        await expectNavigationState(navigation, scenario.navigation);
      });
    }

    for (const route of negativeRoutes) {
      test(`does not activate navigation on ${route.pathname}`, async ({
        page,
      }) => {
        await navigateToRoute(page, route.pathname, route.expectedStatus);

        await expectNoCurrentNavigation(getDesktopNavigation(page));
      });
    }

    test("updates the current link after client-side navigation", async ({
      page,
    }) => {
      await navigateToRoute(
        page,
        englishHome.pathname,
        englishHome.expectedStatus,
      );

      const navigation = getDesktopNavigation(page);

      await expectCurrentNavigation(
        navigation,
        NAVIGATION_LABELS.en.home,
        "page",
      );

      await navigation
        .getByRole("link", {
          name: NAVIGATION_LABELS.en.about,
          exact: true,
        })
        .click();

      await expect(page).toHaveURL(englishAbout.pathname);

      await expectCurrentNavigation(
        navigation,
        NAVIGATION_LABELS.en.about,
        "page",
      );

      await navigation
        .getByRole("link", {
          name: NAVIGATION_LABELS.en.blog,
          exact: true,
        })
        .click();

      await expect(page).toHaveURL(englishBlog.pathname);

      await expectCurrentNavigation(
        navigation,
        NAVIGATION_LABELS.en.blog,
        "page",
      );
    });

    test("updates the current link after browser back navigation", async ({
      page,
    }) => {
      await navigateToRoute(
        page,
        englishHome.pathname,
        englishHome.expectedStatus,
      );

      const navigation = getDesktopNavigation(page);

      await navigation
        .getByRole("link", {
          name: NAVIGATION_LABELS.en.products,
          exact: true,
        })
        .click();

      await expect(page).toHaveURL(englishProducts.pathname);

      await expectCurrentNavigation(
        navigation,
        NAVIGATION_LABELS.en.products,
        "page",
      );

      await page.goBack();

      await expect(page).toHaveURL(englishHome.pathname);

      await expectCurrentNavigation(
        navigation,
        NAVIGATION_LABELS.en.home,
        "page",
      );
    });

    test("preserves active navigation with query parameters", async ({
      page,
    }) => {
      await navigateToRoute(
        page,
        `${englishProducts.pathname}?source=test`,
        englishProducts.expectedStatus,
      );

      await expectCurrentNavigation(
        getDesktopNavigation(page),
        NAVIGATION_LABELS.en.products,
        "page",
      );
    });

    test("preserves active navigation with a URL fragment", async ({
      page,
    }) => {
      await navigateToRoute(
        page,
        `${englishProducts.pathname}#main-content`,
        englishProducts.expectedStatus,
      );

      await expectCurrentNavigation(
        getDesktopNavigation(page),
        NAVIGATION_LABELS.en.products,
        "page",
      );
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

    for (const scenario of navigationScenarios) {
      test(`identifies current mobile navigation on ${scenario.pathname}`, async ({
        page,
      }) => {
        await navigateToRoute(page, scenario.pathname, scenario.expectedStatus);

        const navigation = await openMobileNavigation(page, scenario.locale);

        await expectNavigationState(navigation, scenario.navigation);
      });
    }

    test("updates mobile navigation after selecting another page", async ({
      page,
    }) => {
      await navigateToRoute(
        page,
        englishHome.pathname,
        englishHome.expectedStatus,
      );

      const navigation = await openMobileNavigation(page, "en");

      const dialog = page.getByRole("dialog");

      await expectCurrentNavigation(
        navigation,
        NAVIGATION_LABELS.en.home,
        "page",
      );

      await navigation
        .getByRole("link", {
          name: NAVIGATION_LABELS.en.products,
          exact: true,
        })
        .click();

      await expect(page).toHaveURL(englishProducts.pathname);

      await expect(dialog).toBeHidden();

      const reopenedNavigation = await openMobileNavigation(page, "en");

      await expectCurrentNavigation(
        reopenedNavigation,
        NAVIGATION_LABELS.en.products,
        "page",
      );
    });

    for (const route of negativeRoutes) {
      test(`does not activate mobile navigation on ${route.pathname}`, async ({
        page,
      }) => {
        await navigateToRoute(page, route.pathname, route.expectedStatus);

        const navigation = await openMobileNavigation(page, route.locale);

        await expectNoCurrentNavigation(navigation);
      });
    }
  });

  test.describe("Server-rendered navigation", () => {
    test.use({
      javaScriptEnabled: false,
      viewport: {
        width: 1440,
        height: 900,
      },
    });

    for (const scenario of navigationScenarios) {
      test(`preserves current navigation without JavaScript on ${scenario.pathname}`, async ({
        page,
      }) => {
        await navigateToRoute(page, scenario.pathname, scenario.expectedStatus);

        await expectNavigationState(
          getDesktopNavigation(page),
          scenario.navigation,
        );
      });
    }

    for (const route of negativeRoutes) {
      test(`does not activate navigation without JavaScript on ${route.pathname}`, async ({
        page,
      }) => {
        await navigateToRoute(page, route.pathname, route.expectedStatus);

        test.fail(
          true,
          "A11Y-013: Header navigation is missing from localized 404 responses when JavaScript is disabled.",
        );

        await expectNoCurrentNavigation(getDesktopNavigation(page));
      });
    }
  });
});
