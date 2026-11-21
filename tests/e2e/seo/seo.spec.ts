import { defaultLocale, locales } from "@/i18n/config";
import { expect, test } from "@playwright/test";

const SITE_URL = "https://example.com";

test.describe("Localized SEO", () => {
  test("renders the default locale at /", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.status()).toBe(200);

    await expect(page.locator("html")).toHaveAttribute("lang", defaultLocale);

    await expect(page.locator("h1")).toHaveCount(1);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      SITE_URL,
    );
  });

  test("renders English at /en", async ({ page }) => {
    const response = await page.goto("/en");

    expect(response?.status()).toBe(200);

    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${SITE_URL}/en`,
    );
  });

  test("normalizes the default locale prefix", async ({ page }) => {
    await page.goto(`/${defaultLocale}`);

    await expect(page).toHaveURL("/");
  });

  test("returns 404 for unknown content", async ({ request }) => {
    const response = await request.get("/unknown-content-123456", {
      maxRedirects: 0,
    });

    expect(response.status()).toBe(404);
  });

  test("preserves localized canonical URLs outside production", async ({
    page,
  }) => {
    for (const locale of locales) {
      const pathname = locale === defaultLocale ? "/" : `/${locale}`;

      const expectedCanonical =
        locale === defaultLocale ? SITE_URL : `${SITE_URL}/${locale}`;

      const response = await page.goto(pathname);

      expect(response?.status()).toBe(200);

      await expect(page.locator("html")).toHaveAttribute("lang", locale);

      const canonical = page.locator('link[rel="canonical"]');

      await expect(canonical).toHaveCount(1);

      await expect(canonical).toHaveAttribute("href", expectedCanonical);
    }
  });

  test("omits language alternates outside production", async ({ page }) => {
    for (const locale of locales) {
      const pathname = locale === defaultLocale ? "/" : `/${locale}`;

      const response = await page.goto(pathname);

      expect(response?.status()).toBe(200);

      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        /\bnoindex\b/,
      );

      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(
        0,
      );
    }
  });

  test("renders valid JSON-LD", async ({ page }) => {
    await page.goto("/");

    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();

    expect(scripts.length).toBeGreaterThan(0);

    const documents = scripts.map((value) => JSON.parse(value));

    expect(
      documents.some(
        (document) =>
          document["@context"] === "https://schema.org" &&
          Array.isArray(document["@graph"]),
      ),
    ).toBe(true);
  });

  test("disables indexing outside production", async ({ page }) => {
    for (const locale of locales) {
      const pathname = locale === defaultLocale ? "/" : `/${locale}`;

      await page.goto(pathname);

      const robots = page.locator('meta[name="robots"]');

      await expect(robots).toHaveCount(1);

      await expect(robots).toHaveAttribute("content", /\bnoindex\b/);

      await expect(robots).toHaveAttribute("content", /\bnofollow\b/);

      const googleBot = page.locator('meta[name="googlebot"]');

      await expect(googleBot).toHaveCount(1);

      await expect(googleBot).toHaveAttribute("content", /\bnoindex\b/);

      await expect(googleBot).toHaveAttribute("content", /\bnofollow\b/);
    }
  });
});
