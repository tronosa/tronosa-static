import type { Locale } from "@/i18n/config";
import type { ProductWaterType } from "./product.config";

export type FilterableProduct = {
  waterType: ProductWaterType;
  volumeMl: number;
};

export type CatalogFilters = {
  waterType: ProductWaterType | "all";
  volumeMl: number | "all";
};

export const DEFAULT_CATALOG_FILTERS: CatalogFilters = {
  waterType: "all",
  volumeMl: "all",
};

export function filterCatalogProducts<T extends FilterableProduct>(
  products: readonly T[],
  filters: CatalogFilters,
): T[] {
  return products.filter(
    (product) =>
      (filters.waterType === "all" ||
        product.waterType === filters.waterType) &&
      (filters.volumeMl === "all" || product.volumeMl === filters.volumeMl),
  );
}

export function getCatalogVolumes(
  products: readonly FilterableProduct[],
): number[] {
  return Array.from(new Set(products.map((product) => product.volumeMl))).sort(
    (first, second) => first - second,
  );
}

export function getCatalogWaterTypes(
  products: readonly FilterableProduct[],
): ProductWaterType[] {
  return Array.from(new Set(products.map((product) => product.waterType)));
}

export function formatProductVolume(volumeMl: number, locale: Locale): string {
  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 3,
  });

  if (volumeMl < 1000) {
    return `${formatter.format(volumeMl)} ml`;
  }

  return `${formatter.format(volumeMl / 1000)} L`;
}
