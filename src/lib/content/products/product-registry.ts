import "server-only";

import type { Locale } from "@/i18n/config";

import catalogData from "@/content/products/catalog.json";

import srCyrlTranslations from "@/content/products/translations/sr-Cyrl.json";
import srLatnTranslations from "@/content/products/translations/sr-Latn.json";
import enTranslations from "@/content/products/translations/en.json";

import {
  productCatalogSchema,
  productTranslationsSchema,
  type LocalizedProduct,
} from "@/content/schemas/product.schema";

import type { ProductCategory, ProductWaterType } from "./product.config";

const translationsByLocale = {
  "sr-Cyrl": srCyrlTranslations,
  "sr-Latn": srLatnTranslations,
  en: enTranslations,
} satisfies Record<Locale, unknown>;

type ProductIndex = {
  products: readonly LocalizedProduct[];
  byId: ReadonlyMap<string, LocalizedProduct>;
  bySlug: ReadonlyMap<string, LocalizedProduct>;
};

export type ProductFilters = {
  category?: ProductCategory;
  waterType?: ProductWaterType;
  volumeMl?: number;
  featured?: boolean;
};

const catalog = productCatalogSchema.parse(catalogData);

const indexes = new Map<Locale, ProductIndex>();

function createProductIndex(locale: Locale): ProductIndex {
  const translations = productTranslationsSchema.parse(
    translationsByLocale[locale],
  );

  const catalogIds = new Set(catalog.map((product) => product.id));

  const translationMap = new Map(
    translations.map((translation) => [translation.id, translation]),
  );

  for (const translation of translations) {
    if (!catalogIds.has(translation.id)) {
      throw new Error(
        `[Products] Unknown product "${translation.id}" in locale "${locale}".`,
      );
    }
  }

  const products: LocalizedProduct[] = [];

  for (const product of catalog) {
    const translation = translationMap.get(product.id);

    if (!translation) {
      throw new Error(
        `[Products] Missing translation for "${product.id}" in locale "${locale}".`,
      );
    }

    if (product.status === "published") {
      if (
        !translation.declaration ||
        !translation.storageInstructions ||
        !translation.availability
      ) {
        throw new Error(
          `[Products] Published product "${product.id}" is missing required product information in locale "${locale}".`,
        );
      }
    }

    const { imageAlt, ...localizedContent } = translation;

    products.push({
      ...product,
      ...localizedContent,

      image: {
        ...product.image,
        alt: imageAlt,
      },
    });
  }

  products.sort(
    (first, second) =>
      first.sortOrder - second.sortOrder ||
      first.volumeMl - second.volumeMl ||
      first.id.localeCompare(second.id),
  );

  return {
    products,

    byId: new Map(products.map((product) => [product.id, product])),

    bySlug: new Map(products.map((product) => [product.slug, product])),
  };
}

function getProductIndex(locale: Locale): ProductIndex {
  const existing = indexes.get(locale);

  if (existing) {
    return existing;
  }

  const index = createProductIndex(locale);

  indexes.set(locale, index);

  return index;
}

export function getAllProducts(locale: Locale): readonly LocalizedProduct[] {
  return getProductIndex(locale).products;
}

export function getPublishedProducts(
  locale: Locale,
  filters: ProductFilters = {},
): LocalizedProduct[] {
  return getAllProducts(locale).filter((product) => {
    if (product.status !== "published") {
      return false;
    }

    if (
      filters.category !== undefined &&
      product.category !== filters.category
    ) {
      return false;
    }

    if (
      filters.waterType !== undefined &&
      product.waterType !== filters.waterType
    ) {
      return false;
    }

    if (
      filters.volumeMl !== undefined &&
      product.volumeMl !== filters.volumeMl
    ) {
      return false;
    }

    if (
      filters.featured !== undefined &&
      product.featured !== filters.featured
    ) {
      return false;
    }

    return true;
  });
}

export function getProductById(
  locale: Locale,
  id: string,
): LocalizedProduct | undefined {
  const product = getProductIndex(locale).byId.get(id);

  return product?.status === "published" ? product : undefined;
}

export function getProductBySlug(
  locale: Locale,
  slug: string,
): LocalizedProduct | undefined {
  const product = getProductIndex(locale).bySlug.get(slug);

  return product?.status === "published" ? product : undefined;
}

export function getAvailableProductCategories(
  locale: Locale,
): ProductCategory[] {
  return Array.from(
    new Set(getPublishedProducts(locale).map((product) => product.category)),
  );
}

export function getAvailableProductWaterTypes(
  locale: Locale,
): ProductWaterType[] {
  return Array.from(
    new Set(getPublishedProducts(locale).map((product) => product.waterType)),
  );
}

export function getAvailableProductVolumes(locale: Locale): number[] {
  return Array.from(
    new Set(getPublishedProducts(locale).map((product) => product.volumeMl)),
  ).sort((first, second) => first - second);
}
