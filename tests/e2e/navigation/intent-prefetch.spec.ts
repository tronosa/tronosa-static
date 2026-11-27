import {
  expect,
  test,
  type Locator,
  type Page,
  type Request,
} from "@playwright/test";

const PREFETCH_TIMEOUT_MS = 10_000;
const OBSERVATION_WINDOW_MS = 1_500;

const LOCALES = [
  {
    locale: "sr-Cyrl",
    homePath: "/",
    targetLabel: "Наша прича",
    targetPath: "/nasa-prica",
  },
  {
    locale: "sr-Latn",
    homePath: "/sr-Latn",
    targetLabel: "Naša priča",
    targetPath: "/sr-Latn/nasa-prica",
  },
  {
    locale: "en",
    homePath: "/en",
    targetLabel: "Our Story",
    targetPath: "/en/our-story",
  },
] as const;

function isPrefetchRequest(request: Request): boolean {
  const headers = request.headers();

  return (
    headers["rsc"] === "1" &&
    (headers["next-router-prefetch"] === "1" ||
      headers["next-router-segment-prefetch"] !== undefined)
  );
}

function isRoutePrefetch(request: Request, destination: URL): boolean {
  const requestUrl = new URL(request.url());

  return (
    isPrefetchRequest(request) &&
    requestUrl.origin === destination.origin &&
    requestUrl.pathname === destination.pathname
  );
}

async function getDestination(
  link: Locator,
  expectedPath: string,
): Promise<URL> {
  await expect(link).toHaveCount(1);
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", expectedPath);

  const href = await link.evaluate(
    (element: HTMLAnchorElement) => element.href,
  );

  const destination = new URL(href);

  expect(destination.pathname).toBe(expectedPath);

  return destination;
}

function observePrefetchRequests(page: Page): Request[] {
  const requests: Request[] = [];

  page.on("request", (request) => {
    if (isPrefetchRequest(request)) {
      requests.push(request);
    }
  });

  return requests;
}

function getHeaderLink(page: Page, label: string): Locator {
  return page.getByRole("banner").getByRole("link", {
    name: label,
    exact: true,
  });
}

function getFooterLink(page: Page, label: string): Locator {
  return page.locator("footer [data-footer-navigation]").getByRole("link", {
    name: label,
    exact: true,
  });
}

async function focusUsingKeyboard(page: Page, locator: Locator): Promise<void> {
  await expect(locator).toBeVisible();

  for (let attempt = 0; attempt < 40; attempt += 1) {
    await page.keyboard.press("Tab");

    const focused = await locator.evaluate(
      (element) => document.activeElement === element,
    );

    if (focused) {
      return;
    }
  }

  throw new Error("Navigation link could not be reached using keyboard Tab.");
}

for (const { locale, homePath, targetLabel, targetPath } of LOCALES) {
  test.describe(`Intent prefetch - ${locale}`, () => {
    test.use({
      viewport: {
        width: 1440,
        height: 900,
      },
    });

    test("does not prefetch routes on initial page load", async ({ page }) => {
      const requests = observePrefetchRequests(page);

      await page.goto(homePath, {
        waitUntil: "load",
      });

      await expect(page.getByRole("banner")).toBeVisible();

      await page.waitForTimeout(OBSERVATION_WINDOW_MS);

      expect(requests.map((request) => request.url())).toEqual([]);
    });

    test("does not prefetch routes when scrolling", async ({ page }) => {
      const requests = observePrefetchRequests(page);

      await page.goto(homePath, {
        waitUntil: "load",
      });

      const footer = page.getByRole("contentinfo");

      await footer.scrollIntoViewIfNeeded();

      await expect(footer).toBeVisible();

      await page.waitForTimeout(OBSERVATION_WINDOW_MS);

      expect(requests.map((request) => request.url())).toEqual([]);
    });

    test("prefetches the destination on navigation link hover", async ({
      page,
    }) => {
      await page.goto(homePath, {
        waitUntil: "load",
      });

      const link = getHeaderLink(page, targetLabel);

      const destination = await getDestination(link, targetPath);

      const [request] = await Promise.all([
        page.waitForRequest(
          (candidate) => isRoutePrefetch(candidate, destination),
          {
            timeout: PREFETCH_TIMEOUT_MS,
          },
        ),
        link.hover(),
      ]);

      expect(isPrefetchRequest(request)).toBe(true);

      expect(new URL(request.url()).pathname).toBe(targetPath);
    });

    test("prefetches the destination on keyboard focus", async ({ page }) => {
      await page.goto(homePath, {
        waitUntil: "load",
      });

      const link = getHeaderLink(page, targetLabel);

      const destination = await getDestination(link, targetPath);

      const [request] = await Promise.all([
        page.waitForRequest(
          (candidate) => isRoutePrefetch(candidate, destination),
          {
            timeout: PREFETCH_TIMEOUT_MS,
          },
        ),
        focusUsingKeyboard(page, link),
      ]);

      await expect(link).toBeFocused();

      expect(isPrefetchRequest(request)).toBe(true);

      expect(new URL(request.url()).pathname).toBe(targetPath);
    });

    test("preserves localized navigation after prefetch", async ({ page }) => {
      await page.goto(homePath, {
        waitUntil: "load",
      });

      const link = getHeaderLink(page, targetLabel);

      const destination = await getDestination(link, targetPath);

      await Promise.all([
        page.waitForRequest(
          (request) => isRoutePrefetch(request, destination),
          {
            timeout: PREFETCH_TIMEOUT_MS,
          },
        ),
        link.hover(),
      ]);

      await link.click();

      await expect(page).toHaveURL(destination.href);

      await expect(link).toHaveAttribute("aria-current", "page");
    });

    test("does not prefetch footer links on hover or focus", async ({
      page,
    }) => {
      const requests = observePrefetchRequests(page);

      await page.goto(homePath, {
        waitUntil: "load",
      });

      const link = getFooterLink(page, targetLabel);

      await expect(link).toBeVisible();

      await link.scrollIntoViewIfNeeded();

      const destination = await getDestination(link, targetPath);

      await link.hover();
      await link.focus();

      await expect(link).toBeFocused();

      await page.waitForTimeout(OBSERVATION_WINDOW_MS);

      const destinationRequests = requests.filter((request) =>
        isRoutePrefetch(request, destination),
      );

      expect(destinationRequests.map((request) => request.url())).toEqual([]);
    });
  });
}
