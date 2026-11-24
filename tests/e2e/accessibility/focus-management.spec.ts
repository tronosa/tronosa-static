import { expect, test, type Locator, type Page } from "@playwright/test";

import { getContentTestRoutes } from "../../shared/routes";

const homeRoutes = getContentTestRoutes().filter(
  (route) => route.kind === "page" && route.id === "home",
);

const SITE_HEADER_SELECTOR = "[data-site-header]";

const desktopViewport = {
  width: 1440,
  height: 900,
};

const mobileViewport = {
  width: 390,
  height: 844,
};

function getSiteHeader(page: Page): Locator {
  return page.locator(SITE_HEADER_SELECTOR);
}

function getDesktopNavigation(page: Page): Locator {
  return getSiteHeader(page).getByRole("navigation");
}

function getLanguageSwitcherTrigger(page: Page): Locator {
  return getSiteHeader(page)
    .locator('button[aria-haspopup="dialog"]:not([aria-hidden="true"])')
    .filter({ visible: true })
    .first();
}

function getMobileNavigationTrigger(page: Page): Locator {
  return getSiteHeader(page)
    .locator('button[aria-haspopup="dialog"]:not([aria-hidden="true"])')
    .filter({ visible: true })
    .last();
}

async function expectFocusWithin(dialog: Locator) {
  await expect
    .poll(() =>
      dialog.evaluate((element) => element.contains(document.activeElement)),
    )
    .toBe(true);
}

async function expectNoHiddenFocusedElement(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(() => {
        const active = document.activeElement;

        if (
          !active ||
          active === document.body ||
          active === document.documentElement
        ) {
          return false;
        }

        if (!(active instanceof HTMLElement)) {
          return false;
        }

        const styles = getComputedStyle(active);

        return (
          active.getClientRects().length === 0 ||
          styles.display === "none" ||
          styles.visibility === "hidden" ||
          styles.visibility === "collapse" ||
          active.closest('[aria-hidden="true"], [inert]') !== null
        );
      }),
    )
    .toBe(false);
}

async function openDialogWithKeyboard(page: Page, trigger: Locator) {
  await expect(trigger).toBeVisible();

  await expect(trigger).toBeEnabled();

  await trigger.focus();

  await expect(trigger).toBeFocused();

  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog");

  await expect(dialog).toHaveCount(1);

  await expect(dialog).toBeVisible();

  await expect(dialog).toHaveAccessibleName(/\S/);

  await expectFocusWithin(dialog);

  return dialog;
}

async function expectFocusTrap(
  page: Page,
  dialog: Locator,
  direction: "forward" | "reverse",
) {
  const key = direction === "forward" ? "Tab" : "Shift+Tab";

  const focusableElements = dialog.locator(
    [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(", "),
  );

  const visibleElements = focusableElements.filter({
    visible: true,
  });

  const count = await visibleElements.count();

  expect(count).toBeGreaterThan(0);

  const iterations = count + 2;

  for (let index = 0; index < iterations; index++) {
    await page.keyboard.press(key);

    await expectFocusWithin(dialog);
  }
}

async function expectEscapeDismissal(
  page: Page,
  dialog: Locator,
  trigger: Locator,
) {
  await page.keyboard.press("Escape");

  await expect(dialog).toBeHidden();

  await expect(trigger).toBeFocused();

  await expect(trigger).toHaveAttribute("aria-expanded", "false");
}

test.describe("Focus management @a11y", () => {
  test.describe("Desktop language switcher", () => {
    test.use({
      viewport: desktopViewport,
    });

    for (const route of homeRoutes) {
      test(`${route.locale} | keyboard opening and focus restoration`, async ({
        page,
      }) => {
        await page.goto(route.pathname);

        const trigger = getLanguageSwitcherTrigger(page);

        const dialog = await openDialogWithKeyboard(page, trigger);

        await expect(dialog).toHaveAttribute("aria-modal", "true");

        await expect(trigger).toHaveAttribute("aria-expanded", "true");

        await expectEscapeDismissal(page, dialog, trigger);
      });

      test(`${route.locale} | bidirectional focus trap`, async ({ page }) => {
        await page.goto(route.pathname);

        const trigger = getLanguageSwitcherTrigger(page);

        const dialog = await openDialogWithKeyboard(page, trigger);

        await test.step("Forward keyboard navigation", async () => {
          await expectFocusTrap(page, dialog, "forward");
        });

        await test.step("Reverse keyboard navigation", async () => {
          await expectFocusTrap(page, dialog, "reverse");
        });

        await expectEscapeDismissal(page, dialog, trigger);
      });

      test(`${route.locale} | repeated dialog interaction`, async ({
        page,
      }) => {
        await page.goto(route.pathname);

        const trigger = getLanguageSwitcherTrigger(page);

        for (let iteration = 0; iteration < 3; iteration++) {
          const dialog = await openDialogWithKeyboard(page, trigger);

          await expectEscapeDismissal(page, dialog, trigger);
        }
      });
    }
  });

  test.describe("Mobile language switcher", () => {
    test.use({
      viewport: mobileViewport,
      isMobile: true,
      hasTouch: true,
    });

    for (const route of homeRoutes) {
      test(`${route.locale} | keyboard opening and focus restoration`, async ({
        page,
      }) => {
        await page.goto(route.pathname);

        const trigger = getLanguageSwitcherTrigger(page);

        const dialog = await openDialogWithKeyboard(page, trigger);

        await expect(dialog).toHaveAttribute("aria-modal", "true");

        await expectEscapeDismissal(page, dialog, trigger);
      });

      test(`${route.locale} | bidirectional focus trap`, async ({ page }) => {
        await page.goto(route.pathname);

        const trigger = getLanguageSwitcherTrigger(page);

        const dialog = await openDialogWithKeyboard(page, trigger);

        await expectFocusTrap(page, dialog, "forward");

        await expectFocusTrap(page, dialog, "reverse");

        await expectEscapeDismissal(page, dialog, trigger);
      });
    }
  });

  test.describe("Mobile navigation", () => {
    test.use({
      viewport: mobileViewport,
      isMobile: true,
      hasTouch: true,
    });

    for (const route of homeRoutes) {
      test(`${route.locale} | keyboard opening and focus restoration`, async ({
        page,
      }) => {
        await page.goto(route.pathname);

        const trigger = getMobileNavigationTrigger(page);

        const dialog = await openDialogWithKeyboard(page, trigger);

        await expect(dialog).toHaveAttribute("aria-modal", "true");

        await expect(dialog.getByRole("navigation")).toHaveCount(1);

        await expect(trigger).toHaveAttribute("aria-expanded", "true");

        await expectEscapeDismissal(page, dialog, trigger);
      });

      test(`${route.locale} | bidirectional focus trap`, async ({ page }) => {
        await page.goto(route.pathname);

        const trigger = getMobileNavigationTrigger(page);

        const dialog = await openDialogWithKeyboard(page, trigger);

        await expectFocusTrap(page, dialog, "forward");

        await expectFocusTrap(page, dialog, "reverse");

        await expectEscapeDismissal(page, dialog, trigger);
      });

      test(`${route.locale} | repeated navigation interaction`, async ({
        page,
      }) => {
        await page.goto(route.pathname);

        const trigger = getMobileNavigationTrigger(page);

        for (let iteration = 0; iteration < 3; iteration++) {
          const dialog = await openDialogWithKeyboard(page, trigger);

          await expectEscapeDismissal(page, dialog, trigger);
        }
      });
    }
  });

  test.describe("Responsive navigation focus", () => {
    test.use({
      viewport: mobileViewport,
    });

    for (const route of homeRoutes) {
      test(`${route.locale} | closes mobile navigation on desktop resize`, async ({
        page,
      }) => {
        await page.goto(route.pathname);

        const header = getSiteHeader(page);

        await expect(header).toHaveCount(1);

        const trigger = getMobileNavigationTrigger(page);

        const dialog =
          await test.step("Open mobile navigation using keyboard", async () => {
            const mobileDialog = await openDialogWithKeyboard(page, trigger);

            await expect(mobileDialog).toHaveAttribute("aria-modal", "true");

            await expect(mobileDialog.getByRole("navigation")).toHaveCount(1);

            await expect(trigger).toHaveAttribute("aria-expanded", "true");

            return mobileDialog;
          });

        await test.step("Resize viewport to desktop", async () => {
          await page.setViewportSize(desktopViewport);

          await expect(dialog).toBeHidden();

          await expect(page.getByRole("dialog")).toHaveCount(0);

          const desktopNavigation = getDesktopNavigation(page);

          await expect(desktopNavigation).toHaveCount(1);

          await expect(desktopNavigation).toBeVisible();

          await expect(getLanguageSwitcherTrigger(page)).toBeVisible();

          await expectNoHiddenFocusedElement(page);
        });

        await test.step("Return to mobile viewport", async () => {
          await page.setViewportSize(mobileViewport);

          await expect(getDesktopNavigation(page)).toHaveCount(0);

          await expect(page.getByRole("dialog")).toHaveCount(0);

          const mobileTrigger = getMobileNavigationTrigger(page);

          await expect(mobileTrigger).toBeVisible();

          await expect(mobileTrigger).toBeEnabled();

          await expect(mobileTrigger).toHaveAttribute("aria-expanded", "false");

          await expectNoHiddenFocusedElement(page);

          const reopenedDialog = await openDialogWithKeyboard(
            page,
            mobileTrigger,
          );

          await expectEscapeDismissal(page, reopenedDialog, mobileTrigger);
        });
      });
    }
  });
});
