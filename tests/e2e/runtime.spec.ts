import { expect, test } from "@playwright/test";

const routes = [
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
];

test.describe("Runtime reliability @reliability", () => {
  for (const route of routes) {
    test.describe(route, () => {
      test("does not produce JavaScript runtime errors", async ({ page }) => {
        const errors: string[] = [];

        page.on("pageerror", (error) => {
          errors.push(error.message);
        });

        await page.goto(route);
        await page.waitForLoadState("load");

        expect(errors).toEqual([]);
      });

      test("does not produce hydration errors", async ({ page }) => {
        const errors: string[] = [];

        page.on("console", (message) => {
          const text = message.text();

          if (
            message.type() === "error" &&
            /hydration|hydrating|server rendered|Minified React error #(418|423|425)/i.test(
              text,
            )
          ) {
            errors.push(text);
          }
        });

        await page.goto(route);
        await page.waitForLoadState("load");

        expect(errors).toEqual([]);
      });

      test("does not return unsuccessful local resource responses", async ({
        page,
        baseURL,
      }) => {
        if (!baseURL) {
          throw new Error("Missing Playwright baseURL.");
        }

        const failures: string[] = [];
        const origin = new URL(baseURL).origin;

        page.on("response", (response) => {
          if (
            new URL(response.url()).origin === origin &&
            response.status() >= 400
          ) {
            failures.push(`${response.status()} ${response.url()}`);
          }
        });

        await page.goto(route);
        await page.waitForLoadState("load");

        expect(failures).toEqual([]);
      });

      test("loads rendered images successfully", async ({ page }) => {
        await page.goto(route);

        const images = page.locator("img");
        const count = await images.count();

        for (let index = 0; index < count; index++) {
          const image = images.nth(index);

          await image.evaluate((element) => {
            if (!(element instanceof HTMLImageElement)) {
              throw new Error("Expected an HTML image element.");
            }

            element.loading = "eager";
          });

          await expect
            .poll(
              () =>
                image.evaluate(
                  (element) =>
                    element instanceof HTMLImageElement &&
                    element.complete &&
                    element.naturalWidth > 0,
                ),
              {
                message: `Image failed to load on ${route} at index ${index}`,
              },
            )
            .toBe(true);
        }
      });
    });
  }
});
