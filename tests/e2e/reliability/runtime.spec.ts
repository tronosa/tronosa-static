import { expect, test, type Page } from "@playwright/test";

import {
  getContentTestRoutes,
  getNegativeTestRoutes,
} from "../../shared/routes";

const contentRoutes = getContentTestRoutes();

const negativeRoutes = getNegativeTestRoutes(contentRoutes);

const HYDRATION_ERROR_PATTERN =
  /hydration|hydrating|server rendered|Minified React error #(418|423|425)\b/i;

async function navigateToRoute(
  page: Page,
  pathname: string,
  expectedStatus: number,
) {
  const response = await page.goto(pathname);

  expect(response?.status()).toBe(expectedStatus);

  await page.waitForLoadState("load");

  await expect(page.getByRole("main")).toHaveCount(1);

  await expect(page.getByRole("main")).toBeVisible();
}

test.describe("Runtime reliability @reliability", () => {
  test.describe("Published content", () => {
    for (const route of contentRoutes) {
      test.describe(route.pathname, () => {
        test("does not produce JavaScript runtime errors", async ({ page }) => {
          const errors: string[] = [];

          page.on("pageerror", (error) => {
            errors.push(error.message);
          });

          await navigateToRoute(page, route.pathname, route.expectedStatus);

          expect(
            errors,
            `JavaScript runtime errors on ${route.pathname}`,
          ).toEqual([]);
        });

        test("does not produce hydration errors", async ({ page }) => {
          const errors: string[] = [];

          page.on("console", (message) => {
            const text = message.text();

            if (
              message.type() === "error" &&
              HYDRATION_ERROR_PATTERN.test(text)
            ) {
              errors.push(text);
            }
          });

          await navigateToRoute(page, route.pathname, route.expectedStatus);

          expect(errors, `Hydration errors on ${route.pathname}`).toEqual([]);
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

          await navigateToRoute(page, route.pathname, route.expectedStatus);

          expect(
            failures,
            `Unsuccessful local responses on ${route.pathname}`,
          ).toEqual([]);
        });

        test("does not produce unexpected local network failures", async ({
          page,
          baseURL,
        }) => {
          if (!baseURL) {
            throw new Error("Missing Playwright baseURL.");
          }

          const failures: string[] = [];

          const origin = new URL(baseURL).origin;

          page.on("requestfailed", (request) => {
            if (new URL(request.url()).origin !== origin) {
              return;
            }

            const error = request.failure()?.errorText;

            if (error === "net::ERR_ABORTED") {
              return;
            }

            failures.push(
              [
                request.method(),
                request.resourceType(),
                request.url(),
                error ?? "Unknown network error",
              ].join(" "),
            );
          });

          await navigateToRoute(page, route.pathname, route.expectedStatus);

          expect(
            failures,
            `Local network failures on ${route.pathname}`,
          ).toEqual([]);
        });

        test("loads rendered images successfully", async ({ page }) => {
          await navigateToRoute(page, route.pathname, route.expectedStatus);

          const images = page.locator("img");

          const count = await images.count();

          await images.evaluateAll((elements) => {
            for (const element of elements) {
              if (!(element instanceof HTMLImageElement)) {
                throw new Error("Expected an HTML image element.");
              }

              element.loading = "eager";
            }
          });

          for (let index = 0; index < count; index++) {
            const image = images.nth(index);

            const source = await image.evaluate((element) => {
              if (!(element instanceof HTMLImageElement)) {
                throw new Error("Expected an HTML image element.");
              }

              return element.currentSrc || element.src;
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
                  message: [
                    `Image failed to load on ${route.pathname}.`,
                    `Index: ${index}.`,
                    `Source: ${source}.`,
                  ].join(" "),
                },
              )
              .toBe(true);
          }
        });
      });
    }
  });

  test.describe("Error page reliability", () => {
    for (const route of negativeRoutes) {
      test.describe(route.pathname, () => {
        test("does not produce JavaScript runtime errors", async ({ page }) => {
          const errors: string[] = [];

          page.on("pageerror", (error) => {
            errors.push(error.message);
          });

          await navigateToRoute(page, route.pathname, route.expectedStatus);

          expect(
            errors,
            `JavaScript runtime errors on ${route.pathname}`,
          ).toEqual([]);
        });

        test("does not produce hydration errors", async ({ page }) => {
          const errors: string[] = [];

          page.on("console", (message) => {
            const text = message.text();

            if (
              message.type() === "error" &&
              HYDRATION_ERROR_PATTERN.test(text)
            ) {
              errors.push(text);
            }
          });

          await navigateToRoute(page, route.pathname, route.expectedStatus);

          expect(errors, `Hydration errors on ${route.pathname}`).toEqual([]);
        });

        test("does not return unexpected local resource failures", async ({
          page,
          baseURL,
        }) => {
          if (!baseURL) {
            throw new Error("Missing Playwright baseURL.");
          }

          const failures: string[] = [];

          const origin = new URL(baseURL).origin;

          const expectedURL = new URL(route.pathname, baseURL);

          page.on("response", (response) => {
            const url = new URL(response.url());

            if (url.origin !== origin) {
              return;
            }

            const isExpectedNotFoundResponse =
              response.request().isNavigationRequest() &&
              response.request().frame() === page.mainFrame() &&
              url.pathname === expectedURL.pathname &&
              response.status() === route.expectedStatus;

            if (isExpectedNotFoundResponse) {
              return;
            }

            if (response.status() >= 400) {
              failures.push(`${response.status()} ${response.url()}`);
            }
          });

          await navigateToRoute(page, route.pathname, route.expectedStatus);

          expect(
            failures,
            `Unexpected local responses on ${route.pathname}`,
          ).toEqual([]);
        });
      });
    }
  });
});
