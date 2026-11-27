import { describe, expect, it } from "vitest";

import { createTranslator } from "next-intl";

import enMessages from "@/dictionaries/en.json";
import srLatnMessages from "@/dictionaries/sr-Latn.json";
import srCyrlMessages from "@/dictionaries/sr-Cyrl.json";

import {
  PRODUCT_CATEGORIES,
  PRODUCT_WATER_TYPES,
} from "@/lib/content/products/product.config";

const dictionaries = {
  en: enMessages,

  "sr-Latn": srLatnMessages,

  "sr-Cyrl": srCyrlMessages,
};

const sharedKeys = [
  "facts.volume",

  "facts.waterType",

  "facts.category",

  "information.declaration",

  "information.storage",

  "information.availability",

  "catalog.waterType",

  "catalog.volume",

  "catalog.allWaterTypes",

  "catalog.allVolumes",

  "catalog.reset",

  "catalog.empty",

  "catalog.preview",

  "dialog.eyebrow",

  "dialog.trigger",

  "dialog.close",
] as const;

describe("Product dictionary messages", () => {
  for (const locale of ["sr-Cyrl", "sr-Latn", "en"] as const) {
    describe(locale, () => {
      const t = createTranslator({
        locale,

        messages: dictionaries[locale],

        namespace: "Products",

        onError(error) {
          throw error;
        },
      });

      it.each(sharedKeys)("provides a valid message for %s", (key) => {
        expect(t(key).trim()).not.toBe("");
      });

      it.each(PRODUCT_WATER_TYPES)(
        "provides a water type label for %s",
        (waterType) => {
          expect(t(`waterTypes.${waterType}`).trim()).not.toBe("");
        },
      );

      it.each(PRODUCT_CATEGORIES)(
        "provides a category label for %s",
        (category) => {
          expect(t(`categories.${category}`).trim()).not.toBe("");
        },
      );

      it("provides an accessible product trigger", () => {
        const product = "Test product";

        const result = t(
          "dialog.triggerAccessible",

          { product },
        );

        expect(result).toContain(product);
      });

      it("formats all catalogue result counts", () => {
        for (const count of [
          0,

          1,

          2,

          5,

          11,

          21,

          22,
        ]) {
          expect(t("catalog.results", { count })).toContain(String(count));
        }
      });
    });
  }
});

describe("Product result pluralization", () => {
  it.each([
    [0, "0 products"],

    [1, "1 product"],

    [2, "2 products"],

    [21, "21 products"],
  ] as const)("formats English count %s", (count, expected) => {
    const t = createTranslator({
      locale: "en",

      messages: enMessages,

      namespace: "Products",
    });

    expect(t("catalog.results", { count })).toBe(expected);
  });

  it.each([
    [0, "0 proizvoda"],

    [1, "1 proizvod"],

    [2, "2 proizvoda"],

    [5, "5 proizvoda"],

    [11, "11 proizvoda"],

    [21, "21 proizvod"],

    [22, "22 proizvoda"],
  ] as const)("formats Serbian Latin count %s", (count, expected) => {
    const t = createTranslator({
      locale: "sr-Latn",

      messages: srLatnMessages,

      namespace: "Products",
    });

    expect(t("catalog.results", { count })).toBe(expected);
  });

  it.each([
    [0, "0 производа"],

    [1, "1 производ"],

    [2, "2 производа"],

    [5, "5 производа"],

    [11, "11 производа"],

    [21, "21 производ"],

    [22, "22 производа"],
  ] as const)("formats Serbian Cyrillic count %s", (count, expected) => {
    const t = createTranslator({
      locale: "sr-Cyrl",

      messages: srCyrlMessages,

      namespace: "Products",
    });

    expect(t("catalog.results", { count })).toBe(expected);
  });
});
