import { describe, expect, it } from "vitest";

import {
  DEFAULT_CATALOG_FILTERS,
  filterCatalogProducts,
  getCatalogVolumes,
  getCatalogWaterTypes,
  formatProductVolume,
  type FilterableProduct,
} from "./product-filters";

const products = [
  {
    id: "test-a",
    waterType: "still",
    volumeMl: 500,
  },
  {
    id: "test-b",
    waterType: "sparkling",
    volumeMl: 330,
  },
  {
    id: "test-c",
    waterType: "still",
    volumeMl: 330,
  },
  {
    id: "test-d",
    waterType: "still",
    volumeMl: 1500,
  },
] satisfies Array<FilterableProduct & { id: string }>;

describe("filterCatalogProducts", () => {
  it("returns all products without filters", () => {
    expect(filterCatalogProducts(products, DEFAULT_CATALOG_FILTERS)).toEqual(
      products,
    );
  });

  it("filters products by water type", () => {
    const result = filterCatalogProducts(products, {
      waterType: "sparkling",
      volumeMl: "all",
    });

    expect(result.map(({ id }) => id)).toEqual(["test-b"]);
  });

  it("filters products by volume", () => {
    const result = filterCatalogProducts(products, {
      waterType: "all",
      volumeMl: 330,
    });

    expect(result.map(({ id }) => id)).toEqual(["test-b", "test-c"]);
  });

  it("combines both filters", () => {
    const result = filterCatalogProducts(products, {
      waterType: "still",
      volumeMl: 330,
    });

    expect(result.map(({ id }) => id)).toEqual(["test-c"]);
  });

  it("returns an empty array for unmatched filters", () => {
    expect(
      filterCatalogProducts(products, {
        waterType: "sparkling",
        volumeMl: 1500,
      }),
    ).toEqual([]);
  });

  it("handles an empty catalogue", () => {
    expect(filterCatalogProducts([], DEFAULT_CATALOG_FILTERS)).toEqual([]);
  });

  it("does not mutate the input", () => {
    const original = structuredClone(products);

    filterCatalogProducts(products, {
      waterType: "still",
      volumeMl: 500,
    });

    expect(products).toEqual(original);
  });
});

describe("getCatalogVolumes", () => {
  it("returns unique numerically sorted volumes", () => {
    expect(getCatalogVolumes(products)).toEqual([330, 500, 1500]);
  });

  it("returns no volumes for an empty catalogue", () => {
    expect(getCatalogVolumes([])).toEqual([]);
  });
});

describe("getCatalogWaterTypes", () => {
  it("returns unique water types", () => {
    expect(getCatalogWaterTypes(products)).toEqual(["still", "sparkling"]);
  });

  it("returns no types for an empty catalogue", () => {
    expect(getCatalogWaterTypes([])).toEqual([]);
  });
});

describe("formatProductVolume", () => {
  it.each(["sr-Cyrl", "sr-Latn", "en"] as const)(
    "formats millilitres in %s",
    (locale) => {
      expect(formatProductVolume(330, locale)).toBe("330 ml");

      expect(formatProductVolume(1000, locale)).toBe("1 L");

      expect(formatProductVolume(15000, locale)).toBe("15 L");
    },
  );

  it.each(["sr-Cyrl", "sr-Latn"] as const)(
    "uses the Serbian decimal separator in %s",
    (locale) => {
      expect(formatProductVolume(1500, locale)).toBe("1,5 L");
    },
  );

  it("uses the English decimal separator", () => {
    expect(formatProductVolume(1500, "en")).toBe("1.5 L");
  });
});
