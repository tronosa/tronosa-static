import { expect, test } from "@playwright/test";

test.describe("Localized SEO", () => {
  test("renders the default locale at /", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.status()).toBe(200);

    await expect(page.locator("html")).toHaveAttribute("lang", "sr-Latn");

    await expect(page.locator("h1")).toHaveCount(1);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://example.com",
    );
  });

  test("renders English at /en", async ({ page }) => {
    const response = await page.goto("/en");

    expect(response?.status()).toBe(200);

    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://example.com/en",
    );
  });

  test("normalizes the default locale prefix", async ({ page }) => {
    await page.goto("/sr-Latn");

    await expect(page).toHaveURL("/");
  });

  test("returns 404 for unknown content", async ({ request }) => {
    const response = await request.get("/unknown-content-123456", {
      maxRedirects: 0,
    });

    expect(response.status()).toBe(404);
  });

  test("renders reciprocal language alternates", async ({ page }) => {
    await page.goto("/");

    const alternates = page.locator('link[rel="alternate"][hreflang]');

    const links = await alternates.evaluateAll((nodes) =>
      nodes.map((node) => ({
        language: node.getAttribute("hreflang"),
        href: node.getAttribute("href"),
      })),
    );

    expect(links).toEqual(
      expect.arrayContaining([
        {
          language: "sr-Latn",
          href: "https://example.com",
        },
        {
          language: "en",
          href: "https://example.com/en",
        },
        {
          language: "x-default",
          href: "https://example.com",
        },
      ]),
    );
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
    await page.goto("/");

    const robots = page.locator('meta[name="robots"]');

    await expect(robots).toHaveAttribute("content", /noindex/);
  });
});
