import { expect, test, type Locator, type Page } from "@playwright/test";

import { locales } from "@/i18n/config";

import { getContentTestRoutes } from "../../shared/routes";

const contentRoutes = getContentTestRoutes();

const articleRoutes = locales.map((locale) => {
  const route = contentRoutes.find(
    (entry) => entry.kind === "article" && entry.locale === locale,
  );

  if (!route) {
    throw new Error(`No published article found for locale "${locale}".`);
  }

  return route;
});

const viewports = [
  {
    name: "desktop",
    width: 1440,
    height: 900,
  },
  {
    name: "mobile",
    width: 390,
    height: 844,
  },
] as const;

function getShareTrigger(page: Page): Locator {
  return page
    .locator("main [data-article-hero]")
    .locator('button[aria-haspopup="dialog"][aria-controls]')
    .first();
}

async function getControlledPopover(
  page: Page,
  trigger: Locator,
): Promise<Locator> {
  const popoverId = await trigger.getAttribute("aria-controls");

  if (!popoverId) {
    throw new Error("ShareArticle trigger does not expose aria-controls.");
  }

  return page.locator(`[id=${JSON.stringify(popoverId)}]`);
}

async function openSharePopover(
  page: Page,
  trigger: Locator,
  key: "Enter" | "Space" = "Enter",
): Promise<Locator> {
  await expect(trigger).toBeVisible();
  await expect(trigger).toBeEnabled();

  await trigger.focus();

  await expect(trigger).toBeFocused();

  await trigger.press(key);

  const popover = await getControlledPopover(page, trigger);

  await expect(popover).toBeVisible();
  await expect(popover).toHaveAttribute("role", "dialog");
  await expect(popover).toHaveAccessibleName(/\S/);

  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  return popover;
}

async function expectClosedPopover(
  trigger: Locator,
  popover: Locator,
): Promise<void> {
  await expect(popover).toBeHidden();

  await expect(trigger).toHaveAttribute("aria-expanded", "false");
}

test.describe("Share article accessibility @a11y", () => {
  for (const viewport of viewports) {
    test.describe(viewport.name, () => {
      test.use({
        viewport: {
          width: viewport.width,
          height: viewport.height,
        },
      });

      for (const route of articleRoutes) {
        test.describe(route.locale, () => {
          test.beforeEach(async ({ page }) => {
            const response = await page.goto(route.pathname);

            expect(response?.status()).toBe(route.expectedStatus);
          });

          test("provides accessible collapsed semantics", async ({ page }) => {
            const trigger = getShareTrigger(page);

            await expect(trigger).toBeVisible();
            await expect(trigger).toBeEnabled();
            await expect(trigger).toHaveAccessibleName(/\S/);

            await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");

            await expect(trigger).toHaveAttribute("aria-expanded", "false");

            const popover = await getControlledPopover(page, trigger);

            await expect(popover).toHaveCount(1);

            await expect(popover).toHaveAttribute("popover", "auto");

            await expect(popover).toBeHidden();

            await expect(page.getByRole("dialog")).toHaveCount(0);
          });

          test("opens with Enter and moves focus to the first action", async ({
            page,
          }) => {
            const trigger = getShareTrigger(page);

            const popover = await openSharePopover(page, trigger, "Enter");

            const firstAction = popover.getByRole("link").first();

            await expect(firstAction).toBeFocused();

            await expect(popover).not.toHaveAttribute("aria-modal", "true");
          });

          test("opens with Space and restores focus after Escape", async ({
            page,
          }) => {
            const trigger = getShareTrigger(page);

            const popover = await openSharePopover(page, trigger, "Space");

            await expect(popover.getByRole("link").first()).toBeFocused();

            await page.keyboard.press("Escape");

            await expectClosedPopover(trigger, popover);

            await expect(trigger).toBeFocused();
          });

          test("provides logical keyboard navigation through share actions", async ({
            page,
          }) => {
            const trigger = getShareTrigger(page);

            const popover = await openSharePopover(page, trigger);

            const linkedin = popover.locator('a[href*="linkedin.com"]');

            const facebook = popover.locator('a[href*="facebook.com"]');

            const buttons = popover.getByRole("button");

            await expect(buttons).toHaveCount(2);

            const copyButton = buttons.nth(0);
            const moreButton = buttons.nth(1);

            await expect(linkedin).toBeFocused();

            await page.keyboard.press("Tab");

            await expect(facebook).toBeFocused();

            await page.keyboard.press("Tab");

            await expect(copyButton).toBeFocused();

            await page.keyboard.press("Tab");

            await expect(moreButton).toBeFocused();

            await page.keyboard.press("Shift+Tab");

            await expect(copyButton).toBeFocused();

            await page.keyboard.press("Shift+Tab");

            await expect(facebook).toBeFocused();

            await page.keyboard.press("Shift+Tab");

            await expect(linkedin).toBeFocused();
          });

          test("does not trap focus inside a non-modal popover", async ({
            page,
          }) => {
            const trigger = getShareTrigger(page);

            const popover = await openSharePopover(page, trigger);

            const lastAction = popover.getByRole("button").last();

            await lastAction.focus();

            await expect(lastAction).toBeFocused();

            await page.keyboard.press("Tab");

            await expect
              .poll(async () => {
                return popover.evaluate(
                  (element) => !element.contains(document.activeElement),
                );
              })
              .toBe(true);
          });

          test("exposes accessible names for all share actions", async ({
            page,
          }) => {
            const trigger = getShareTrigger(page);

            const popover = await openSharePopover(page, trigger);

            const links = popover.getByRole("link");
            const buttons = popover.getByRole("button");

            await expect(links).toHaveCount(2);
            await expect(buttons).toHaveCount(2);

            for (const link of await links.all()) {
              await expect(link).toHaveAccessibleName(/\S/);
            }

            for (const button of await buttons.all()) {
              await expect(button).toHaveAccessibleName(/\S/);
            }
          });

          test("dismisses the popover when the trigger is activated again", async ({
            page,
          }) => {
            const trigger = getShareTrigger(page);

            const popover = await openSharePopover(page, trigger);

            await trigger.focus();

            await expect(trigger).toBeFocused();

            await trigger.press("Enter");

            await expectClosedPopover(trigger, popover);
            await expect(trigger).toBeFocused();
          });

          test("supports repeated keyboard opening and dismissal", async ({
            page,
          }) => {
            const trigger = getShareTrigger(page);

            for (let iteration = 0; iteration < 3; iteration++) {
              const popover = await openSharePopover(page, trigger);

              await expect(popover.getByRole("link").first()).toBeFocused();

              await page.keyboard.press("Escape");

              await expectClosedPopover(trigger, popover);
              await expect(trigger).toBeFocused();
            }
          });

          test("keeps collapsed share actions outside the sequential focus order", async ({
            page,
          }) => {
            const trigger = getShareTrigger(page);

            const popover = await getControlledPopover(page, trigger);

            await expectClosedPopover(trigger, popover);

            await trigger.focus();

            await expect(trigger).toBeFocused();

            await page.keyboard.press("Tab");

            await expect
              .poll(async () => {
                return popover.evaluate(
                  (element) => !element.contains(document.activeElement),
                );
              })
              .toBe(true);

            await expectClosedPopover(trigger, popover);
          });

          test("announces successful clipboard copying", async ({
            page,
            context,
          }) => {
            await context.grantPermissions([
              "clipboard-read",
              "clipboard-write",
            ]);

            const trigger = getShareTrigger(page);

            const popover = await openSharePopover(page, trigger);

            const copyButton = popover.getByRole("button").first();

            const status = popover.getByRole("status");

            const initialButtonLabel = (await copyButton.innerText()).trim();

            expect(initialButtonLabel).not.toBe("");

            await expect(status).toHaveCount(1);

            await expect(status).toHaveAttribute("aria-live", "polite");

            await expect(status).toHaveClass(/(?:^|\s)sr-only(?:\s|$)/);

            await expect(status).toHaveText("");

            await copyButton.focus();

            await expect(copyButton).toBeFocused();

            await copyButton.press("Enter");

            await expect(status).toHaveText(/\S/);

            await expect(copyButton).not.toHaveText(initialButtonLabel);

            const updatedButtonLabel = (await copyButton.innerText()).trim();

            expect(updatedButtonLabel).not.toBe("");

            expect(updatedButtonLabel).not.toBe(initialButtonLabel);

            await expect(status).toHaveText(updatedButtonLabel);

            await expect(copyButton).toHaveAccessibleName(updatedButtonLabel);

            await expect(copyButton).toBeFocused();

            const canonicalUrl = await page
              .locator('link[rel="canonical"]')
              .getAttribute("href");

            expect(canonicalUrl).toBeTruthy();

            await expect
              .poll(async () => {
                return page.evaluate(() => navigator.clipboard.readText());
              })
              .toBe(canonicalUrl);

            await page.keyboard.press("Escape");

            await expectClosedPopover(trigger, popover);
            await expect(trigger).toBeFocused();
          });
        });
      }
    });
  }
});
