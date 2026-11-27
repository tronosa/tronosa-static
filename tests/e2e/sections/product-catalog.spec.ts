import { expect, test, type Locator, type Page } from "@playwright/test";

import { locales } from "@/i18n/config";

import { getSectionTestRoutes } from "../../shared/routes";

const routes = getSectionTestRoutes("product-catalog");

for (const locale of locales) {
  if (!routes.some((route) => route.locale === locale)) {
    throw new Error(`Product catalogue is missing for locale "${locale}".`);
  }
}

type CatalogRoute = (typeof routes)[number];

async function navigateToCatalog(
  page: Page,
  route: CatalogRoute,
): Promise<Locator> {
  const response = await page.goto(route.pathname);

  expect(response?.status()).toBe(route.expectedStatus);

  const catalog = page.locator("main [data-product-catalog]");

  await expect(catalog).toHaveCount(1);
  await expect(catalog).toBeVisible();

  return catalog;
}

function getCards(catalog: Locator): Locator {
  return catalog.locator("[data-product-id]");
}

function getWaterTypeFilter(catalog: Locator): Locator {
  return catalog.getByRole("combobox").nth(0);
}

function getVolumeFilter(catalog: Locator): Locator {
  return catalog.getByRole("combobox").nth(1);
}

function getResetButton(catalog: Locator): Locator {
  return catalog.locator(
    'button[type="button"]:not([role="combobox"]):not([aria-haspopup="dialog"])',
  );
}

function getDetailsTrigger(card: Locator): Locator {
  return card.locator('button[aria-haspopup="dialog"]');
}

async function getProductIds(catalog: Locator): Promise<string[]> {
  return getCards(catalog).evaluateAll((cards) =>
    cards.map((card) => card.getAttribute("data-product-id") ?? ""),
  );
}

async function getFilterOptions(
  page: Page,
  filter: Locator,
): Promise<string[]> {
  await filter.click();

  const listbox = page.getByRole("listbox");

  await expect(listbox).toBeVisible();

  const options = await listbox.getByRole("option").allTextContents();

  await page.keyboard.press("Escape");

  await expect(listbox).not.toBeVisible();

  return options;
}

async function selectOption(
  page: Page,
  filter: Locator,
  optionIndex: number,
): Promise<void> {
  await filter.click();

  const listbox = page.getByRole("listbox");

  await expect(listbox).toBeVisible();

  const option = listbox.getByRole("option").nth(optionIndex);

  await expect(option).toBeVisible();

  await option.click();

  await expect(listbox).not.toBeVisible();
}

async function expectResultCount(
  catalog: Locator,
  count: number,
): Promise<void> {
  await expect(getCards(catalog)).toHaveCount(count);

  await expect(catalog.getByRole("status")).toContainText(
    new RegExp(`\\b${count}\\b`),
  );
}

async function openProductDialog(
  page: Page,
  trigger: Locator,
): Promise<Locator> {
  await expect(trigger).toBeVisible();
  await expect(trigger).toBeEnabled();

  await trigger.click();

  const dialog = page.getByRole("dialog");

  await expect(dialog).toHaveCount(1);
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleName(/\S/);

  return dialog;
}

test.describe("Product catalogue @products", () => {
  test.use({
    reducedMotion: "reduce",
  });

  for (const route of routes) {
    test.describe(route.pathname, () => {
      test("renders the catalogue and product cards", async ({ page }) => {
        const catalog = await navigateToCatalog(page, route);

        const cards = getCards(catalog);

        await expect(cards.first()).toBeVisible();

        const ids = await getProductIds(catalog);

        expect(ids.length).toBeGreaterThan(0);

        expect(ids.every(Boolean)).toBe(true);

        expect(new Set(ids).size).toBe(ids.length);

        await expectResultCount(catalog, ids.length);

        for (const card of await cards.all()) {
          await expect(getDetailsTrigger(card)).toHaveCount(1);

          await expect(getDetailsTrigger(card)).toHaveAccessibleName(/\S/);

          await expect(card.getByRole("heading", { level: 3 })).not.toBeEmpty();
        }
      });

      test("renders accessible Radix filters", async ({ page }) => {
        const catalog = await navigateToCatalog(page, route);

        await expect(catalog.getByRole("combobox")).toHaveCount(2);

        const waterType = getWaterTypeFilter(catalog);

        const volume = getVolumeFilter(catalog);

        await expect(waterType).toHaveAccessibleName(/\S/);

        await expect(volume).toHaveAccessibleName(/\S/);

        await expect(waterType).toBeEnabled();

        await expect(volume).toBeEnabled();

        const waterOptions = await getFilterOptions(page, waterType);

        const volumeOptions = await getFilterOptions(page, volume);

        expect(waterOptions.length).toBeGreaterThan(1);

        expect(volumeOptions.length).toBeGreaterThan(1);

        expect(new Set(waterOptions).size).toBe(waterOptions.length);

        expect(new Set(volumeOptions).size).toBe(volumeOptions.length);
      });

      test("filters products by water type", async ({ page }) => {
        const catalog = await navigateToCatalog(page, route);

        const initialIds = await getProductIds(catalog);

        const filter = getWaterTypeFilter(catalog);

        const options = await getFilterOptions(page, filter);

        const matchedIds = new Set<string>();

        for (let index = 1; index < options.length; index++) {
          await selectOption(page, filter, index);

          const ids = await getProductIds(catalog);

          expect(ids.length).toBeGreaterThan(0);

          for (const id of ids) {
            expect(initialIds).toContain(id);

            expect(matchedIds.has(id)).toBe(false);

            matchedIds.add(id);
          }

          await expectResultCount(catalog, ids.length);
        }

        expect([...matchedIds].sort()).toEqual([...initialIds].sort());

        await selectOption(page, filter, 0);

        await expectResultCount(catalog, initialIds.length);

        expect(await getProductIds(catalog)).toEqual(initialIds);
      });

      test("filters products by volume", async ({ page }) => {
        const catalog = await navigateToCatalog(page, route);

        const initialIds = await getProductIds(catalog);

        const filter = getVolumeFilter(catalog);

        const options = await getFilterOptions(page, filter);

        const matchedIds = new Set<string>();

        for (let index = 1; index < options.length; index++) {
          await selectOption(page, filter, index);

          const ids = await getProductIds(catalog);

          expect(ids.length).toBeGreaterThan(0);

          for (const id of ids) {
            expect(initialIds).toContain(id);

            expect(matchedIds.has(id)).toBe(false);

            matchedIds.add(id);
          }

          await expectResultCount(catalog, ids.length);
        }

        expect([...matchedIds].sort()).toEqual([...initialIds].sort());

        await selectOption(page, filter, 0);

        expect(await getProductIds(catalog)).toEqual(initialIds);
      });

      test("combines water type and volume filters", async ({ page }) => {
        const catalog = await navigateToCatalog(page, route);

        const waterType = getWaterTypeFilter(catalog);

        const volume = getVolumeFilter(catalog);

        await selectOption(page, waterType, 1);

        const waterTypeIds = await getProductIds(catalog);

        await selectOption(page, waterType, 0);

        await selectOption(page, volume, 1);

        const volumeIds = await getProductIds(catalog);

        await selectOption(page, waterType, 1);

        const combinedIds = await getProductIds(catalog);

        const expectedIds = volumeIds.filter((id) => waterTypeIds.includes(id));

        await expectResultCount(catalog, expectedIds.length);

        expect(combinedIds).toEqual(expectedIds);

        if (expectedIds.length === 0) {
          await expect(
            catalog.locator("[data-product-catalog-results]"),
          ).toHaveCount(0);
        }
      });

      test("resets both filters and restores catalogue order", async ({
        page,
      }) => {
        const catalog = await navigateToCatalog(page, route);

        const initialIds = await getProductIds(catalog);

        const waterType = getWaterTypeFilter(catalog);

        const volume = getVolumeFilter(catalog);

        const reset = getResetButton(catalog);

        const initialWaterType = await waterType.textContent();

        const initialVolume = await volume.textContent();

        await expect(reset).toHaveCount(1);

        await expect(reset).toBeDisabled();

        await selectOption(page, waterType, 1);

        await selectOption(page, volume, 1);

        await expect(reset).toBeEnabled();

        await reset.click();

        await expect(reset).toBeDisabled();

        await expectResultCount(catalog, initialIds.length);

        await expect(waterType).toHaveText(initialWaterType ?? "");

        await expect(volume).toHaveText(initialVolume ?? "");

        expect(await getProductIds(catalog)).toEqual(initialIds);
      });

      test("supports keyboard filter navigation", async ({ page }) => {
        const catalog = await navigateToCatalog(page, route);

        const filter = getWaterTypeFilter(catalog);

        await filter.focus();

        await expect(filter).toBeFocused();

        await filter.press("Enter");

        const listbox = page.getByRole("listbox");

        await expect(listbox).toBeVisible();

        await page.keyboard.press("ArrowDown");

        await page.keyboard.press("Enter");

        await expect(listbox).not.toBeVisible();

        await expect(filter).toBeFocused();

        await expect(getResetButton(catalog)).toBeEnabled();
      });

      test("opens an information-only dialog for every product", async ({
        page,
      }) => {
        const catalog = await navigateToCatalog(page, route);

        const cards = getCards(catalog);

        const count = await cards.count();

        expect(count).toBeGreaterThan(0);

        for (let index = 0; index < count; index++) {
          const card = cards.nth(index);

          const title = await card
            .getByRole("heading", { level: 3 })
            .innerText();

          const trigger = getDetailsTrigger(card);

          const dialog = await openProductDialog(page, trigger);

          await expect(dialog.getByRole("heading", { level: 2 })).toContainText(
            title,
          );

          await expect(dialog.locator("dl dt")).toHaveCount(3);

          await expect(dialog.locator("dl dd")).toHaveCount(3);

          await expect(dialog.locator("img, picture, video")).toHaveCount(0);

          await expect(dialog).toHaveAccessibleDescription(/\S/);

          await page.keyboard.press("Escape");

          await expect(dialog).not.toBeVisible();

          await expect(trigger).toBeFocused();
        }
      });

      test("opens and closes the product dialog using keyboard", async ({
        page,
      }) => {
        const catalog = await navigateToCatalog(page, route);

        const trigger = getDetailsTrigger(getCards(catalog).first());

        await trigger.focus();

        await expect(trigger).toBeFocused();

        await trigger.press("Enter");

        const dialog = page.getByRole("dialog");

        await expect(dialog).toBeVisible();

        await expect(trigger).toHaveAttribute("aria-expanded", "true");

        await page.keyboard.press("Escape");

        await expect(dialog).not.toBeVisible();

        await expect(trigger).toHaveAttribute("aria-expanded", "false");

        await expect(trigger).toBeFocused();
      });

      test("keeps keyboard focus inside the open dialog", async ({ page }) => {
        const catalog = await navigateToCatalog(page, route);

        const trigger = getDetailsTrigger(getCards(catalog).first());

        const dialog = await openProductDialog(page, trigger);

        const buttons = dialog.getByRole("button");

        const count = await buttons.count();

        expect(count).toBeGreaterThan(0);

        for (let index = 0; index <= count; index++) {
          await page.keyboard.press("Tab");

          const focusInside = await dialog.evaluate((element) =>
            element.contains(document.activeElement),
          );

          expect(focusInside).toBe(true);
        }

        await page.keyboard.press("Shift+Tab");

        expect(
          await dialog.evaluate((element) =>
            element.contains(document.activeElement),
          ),
        ).toBe(true);

        await page.keyboard.press("Escape");

        await expect(trigger).toBeFocused();
      });

      test("preserves filters after closing a product dialog", async ({
        page,
      }) => {
        const catalog = await navigateToCatalog(page, route);

        await selectOption(page, getWaterTypeFilter(catalog), 1);

        const filteredIds = await getProductIds(catalog);

        expect(filteredIds.length).toBeGreaterThan(0);

        const trigger = getDetailsTrigger(getCards(catalog).first());

        const dialog = await openProductDialog(page, trigger);

        await page.keyboard.press("Escape");

        await expect(dialog).not.toBeVisible();

        expect(await getProductIds(catalog)).toEqual(filteredIds);

        await expectResultCount(catalog, filteredIds.length);
      });

      test("renders a usable catalogue on mobile", async ({ page }) => {
        await page.setViewportSize({
          width: 390,
          height: 844,
        });

        const catalog = await navigateToCatalog(page, route);

        const filter = getWaterTypeFilter(catalog);

        await selectOption(page, filter, 1);

        const cards = getCards(catalog);

        await expect(cards.first()).toBeVisible();

        const trigger = getDetailsTrigger(cards.first());

        const dialog = await openProductDialog(page, trigger);

        const bounds = await dialog.boundingBox();

        expect(bounds).not.toBeNull();

        if (bounds) {
          expect(bounds.x).toBeGreaterThanOrEqual(-1);

          expect(bounds.x + bounds.width).toBeLessThanOrEqual(391);

          expect(bounds.y).toBeGreaterThanOrEqual(-1);

          expect(bounds.y + bounds.height).toBeLessThanOrEqual(845);
        }

        await page.keyboard.press("Escape");

        await expect(dialog).not.toBeVisible();

        await expect(trigger).toBeFocused();
      });
    });
  }
});
