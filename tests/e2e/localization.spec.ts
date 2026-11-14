import { expect, test } from "@playwright/test";

test.describe("Localized routing", () => {
  test("renders Serbian at the root URL", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.status()).toBe(200);

    await expect(page.locator("html")).toHaveAttribute("lang", "sr-Latn");
  });

  test("renders English at /en", async ({ page }) => {
    const response = await page.goto("/en");

    expect(response?.status()).toBe(200);

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("redirects default locale prefix", async ({ page }) => {
    await page.goto("/sr-Latn");

    await expect(page).toHaveURL("/");
  });

  test("returns 404 for an unknown page", async ({ request }) => {
    const response = await request.get("/unknown-page-123456");

    expect(response.status()).toBe(404);
  });
});
