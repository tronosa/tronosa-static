import { expect, test } from "@playwright/test";

import { defaultLocale, locales } from "@/i18n/config";

test.describe("Localized routing", () => {
  test("renders the default locale at the root URL", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.status()).toBe(200);

    await expect(page.locator("html")).toHaveAttribute("lang", defaultLocale);
  });

  for (const locale of locales.filter((locale) => locale !== defaultLocale)) {
    test(`renders ${locale} at /${locale}`, async ({ page }) => {
      const response = await page.goto(`/${locale}`);

      expect(response?.status()).toBe(200);

      await expect(page.locator("html")).toHaveAttribute("lang", locale);
    });
  }

  test("redirects default locale prefix", async ({ page }) => {
    await page.goto(`/${defaultLocale}`);

    await expect(page).toHaveURL("/");
  });

  test("returns 404 for an unknown page", async ({ request }) => {
    const response = await request.get("/unknown-page");

    expect(response.status()).toBe(404);
  });
});
