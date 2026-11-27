import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Locale } from "@/i18n/config";

const mocks = vi.hoisted(() => ({
  getTranslations: vi.fn(),

  translate: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("next-intl/server", () => ({
  getTranslations: mocks.getTranslations,
}));

import {
  getProductLabels,
  getProductCatalogLabels,
  getProductDialogTriggerLabel,
} from "@/lib/content/products/product-labels";

beforeEach(() => {
  vi.resetAllMocks();

  mocks.translate.mockImplementation(
    (
      key: string,

      values?: Record<string, string | number>,
    ) => {
      if (values) {
        return `${key}:${JSON.stringify(values)}`;
      }

      return key;
    },
  );

  mocks.getTranslations.mockResolvedValue(mocks.translate);
});

const locales: Locale[] = ["sr-Cyrl", "sr-Latn", "en"];

describe("getProductLabels", () => {
  it.each(locales)("loads product messages for %s", async (locale) => {
    await getProductLabels(locale);

    expect(mocks.getTranslations).toHaveBeenCalledWith({
      locale,

      namespace: "Products",
    });
  });

  it("resolves product fact labels", async () => {
    const result = await getProductLabels("en");

    expect(result.facts).toEqual({
      volume: "facts.volume",

      waterType: "facts.waterType",

      category: "facts.category",
    });
  });

  it("resolves all water type labels", async () => {
    const result = await getProductLabels("en");

    expect(result.waterTypes).toEqual({
      still: "waterTypes.still",

      sparkling: "waterTypes.sparkling",
    });
  });

  it("resolves all product categories", async () => {
    const result = await getProductLabels("en");

    expect(result.categories).toEqual({
      still: "categories.still",

      sparkling: "categories.sparkling",

      sport: "categories.sport",

      kids: "categories.kids",

      "large-format": "categories.large-format",
    });
  });

  it("resolves optional information labels", async () => {
    const result = await getProductLabels("en");

    expect(result.information).toEqual({
      declaration: "information.declaration",

      storage: "information.storage",

      availability: "information.availability",
    });
  });

  it("resolves dialog labels", async () => {
    const result = await getProductLabels("en");

    expect(result.dialog).toEqual({
      eyebrow: "dialog.eyebrow",

      trigger: "dialog.trigger",

      close: "dialog.close",
    });
  });
});

describe("getProductCatalogLabels", () => {
  it.each(locales)("loads catalogue messages for %s", async (locale) => {
    await getProductCatalogLabels(locale, 3);

    expect(mocks.getTranslations).toHaveBeenCalledWith({
      locale,

      namespace: "Products",
    });
  });

  it("resolves catalogue interface labels", async () => {
    const result = await getProductCatalogLabels("en", 2);

    expect(result).toMatchObject({
      waterType: "catalog.waterType",

      volume: "catalog.volume",

      allWaterTypes: "catalog.allWaterTypes",

      allVolumes: "catalog.allVolumes",

      reset: "catalog.reset",

      empty: "catalog.empty",

      preview: "catalog.preview",

      waterTypes: {
        still: "waterTypes.still",

        sparkling: "waterTypes.sparkling",
      },
    });
  });

  it("prepares messages for all possible result counts", async () => {
    const result = await getProductCatalogLabels("en", 3);

    expect(result.resultsByCount).toEqual([
      'catalog.results:{"count":0}',

      'catalog.results:{"count":1}',

      'catalog.results:{"count":2}',

      'catalog.results:{"count":3}',
    ]);

    for (const count of [0, 1, 2, 3]) {
      expect(mocks.translate).toHaveBeenCalledWith(
        "catalog.results",

        { count },
      );
    }
  });

  it("supports an empty catalogue", async () => {
    const result = await getProductCatalogLabels("en", 0);

    expect(result.resultsByCount).toEqual(['catalog.results:{"count":0}']);
  });
});

describe("getProductDialogTriggerLabel", () => {
  it.each(locales)(
    "loads accessible dialog messages for %s",
    async (locale) => {
      await getProductDialogTriggerLabel(
        locale,

        "Test product",
      );

      expect(mocks.getTranslations).toHaveBeenCalledWith({
        locale,

        namespace: "Products.dialog",
      });
    },
  );

  it("interpolates the localized product title", async () => {
    const result = await getProductDialogTriggerLabel(
      "en",

      "Test product — 500 ml",
    );

    expect(mocks.translate).toHaveBeenCalledWith(
      "triggerAccessible",

      {
        product: "Test product — 500 ml",
      },
    );

    expect(result).toBe(
      'triggerAccessible:{"product":"Test product — 500 ml"}',
    );
  });
});
