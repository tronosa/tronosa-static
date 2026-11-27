import { expect, test, type Page } from "@playwright/test";

import { getSectionTestRoutes } from "../../shared/routes";

const routes = getSectionTestRoutes("contact-form");

type ContactRoute = (typeof routes)[number];

async function navigateToContactSection(page: Page, route: ContactRoute) {
  const response = await page.goto(route.pathname);

  expect(response?.status()).toBe(route.expectedStatus);

  const section = page.locator("main [data-contact-form]");

  await expect(section).toHaveCount(1);
  await expect(section).toBeVisible();

  return section;
}

test.describe("Contact form layout @contact", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("https://api.web3forms.com/submit", (route) =>
      route.abort(),
    );

    await page.route(/^https:\/\/(?:[^/]+\.)?hcaptcha\.com(?:\/|$)/, (route) =>
      route.abort(),
    );
  });

  for (const route of routes) {
    test.describe(route.pathname, () => {
      test("preserves page heading hierarchy", async ({ page }) => {
        const section = await navigateToContactSection(page, route);

        await expect(page.locator("main h1")).toHaveCount(1);

        await expect(section.getByRole("heading", { level: 1 })).toHaveCount(0);

        const heading = section.getByRole("heading", {
          level: 2,
        });

        await expect(heading).toHaveCount(1);
        await expect(heading).toBeVisible();
        await expect(heading).not.toBeEmpty();

        const headingId = await heading.getAttribute("id");

        expect(headingId).toBeTruthy();

        await expect(section).toHaveAttribute("aria-labelledby", headingId!);

        const headingText = await heading.innerText();

        await expect(section).toHaveAccessibleName(headingText);
      });

      test("renders one accessible form", async ({ page }) => {
        const section = await navigateToContactSection(page, route);

        const form = section.getByRole("form");

        await expect(form).toHaveCount(1);
        await expect(form).toBeVisible();

        const fields = form.locator("input:not([type='hidden']), textarea");

        expect(await fields.count()).toBeGreaterThan(0);

        for (const field of await fields.all()) {
          await expect(field).toHaveAccessibleName(/\S/);
        }
      });

      test("renders a valid desktop layout", async ({ page }) => {
        await page.setViewportSize({
          width: 1440,
          height: 1000,
        });

        const section = await navigateToContactSection(page, route);

        const header = section.locator("[data-contact-header]");

        const body = section.locator("[data-contact-body]");

        await expect(header).toBeVisible();
        await expect(body).toBeVisible();

        const headerBounds = await header.boundingBox();
        const bodyBounds = await body.boundingBox();

        expect(headerBounds).not.toBeNull();
        expect(bodyBounds).not.toBeNull();

        if (!headerBounds || !bodyBounds) {
          throw new Error("Contact form layout bounds are unavailable.");
        }

        expect(headerBounds.x + headerBounds.width).toBeLessThanOrEqual(
          bodyBounds.x + 1,
        );

        expect(Math.abs(headerBounds.y - bodyBounds.y)).toBeLessThanOrEqual(2);

        const topics = section.locator("[data-contact-topics]");

        if ((await topics.count()) > 0) {
          await expect(topics).toBeVisible();

          const items = topics.getByRole("listitem");

          expect(await items.count()).toBeGreaterThan(0);

          for (const item of await items.all()) {
            await expect(item).toBeVisible();
            await expect(item).not.toBeEmpty();
          }
        }
      });

      test("keeps decoration inaccessible and non-interactive", async ({
        page,
      }) => {
        const section = await navigateToContactSection(page, route);

        const decorations = section.locator("[data-contact-decoration]");

        for (const decoration of await decorations.all()) {
          await expect(decoration).toHaveAttribute("aria-hidden", "true");

          await expect(decoration).toHaveAttribute("focusable", "false");

          await expect(decoration).toHaveCSS("pointer-events", "none");
        }
      });

      for (const width of [320, 390, 768]) {
        test(`renders a compact layout at ${width}px`, async ({ page }) => {
          await page.setViewportSize({
            width,
            height: 844,
          });

          const section = await navigateToContactSection(page, route);

          const header = section.locator("[data-contact-header]");

          const body = section.locator("[data-contact-body]");

          await expect(header).toBeVisible();
          await expect(body).toBeVisible();

          await expect(header.getByRole("heading", { level: 2 })).toBeVisible();

          await expect(section.locator("[data-contact-topics]")).toBeHidden();

          await expect(
            section.locator("[data-contact-decoration]"),
          ).toBeHidden();

          const headerBounds = await header.boundingBox();
          const bodyBounds = await body.boundingBox();

          expect(headerBounds).not.toBeNull();
          expect(bodyBounds).not.toBeNull();

          if (!headerBounds || !bodyBounds) {
            throw new Error("Contact form layout bounds are unavailable.");
          }

          expect(bodyBounds.y).toBeGreaterThanOrEqual(
            headerBounds.y + headerBounds.height - 1,
          );

          const hasHorizontalOverflow = await section.evaluate(
            (element) => element.scrollWidth > element.clientWidth + 1,
          );

          expect(hasHorizontalOverflow).toBe(false);

          await expect(section.getByRole("form")).toHaveCount(1);
        });
      }

      test("renders without decorative network media", async ({ page }) => {
        const section = await navigateToContactSection(page, route);

        await expect(
          section.locator(
            "[data-contact-header] img, " +
              "[data-contact-header] picture, " +
              "[data-contact-header] video, " +
              "[data-contact-header] canvas, " +
              "[data-contact-header] iframe",
          ),
        ).toHaveCount(0);
      });
    });
  }
});
