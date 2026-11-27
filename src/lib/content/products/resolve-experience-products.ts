import type { Locale } from "@/i18n/config";

import type { LocalizedProduct } from "@/content/schemas/product.schema";

import type { ExperienceProduct } from "@/components/sections/ProductExperience/types";

export function resolveExperienceProducts(
  productIds: readonly string[],
  products: readonly LocalizedProduct[],
  locale: Locale,
  allowDrafts: boolean,
): LocalizedProduct[] {
  if (new Set(productIds).size !== productIds.length) {
    throw new Error("[ProductExperience] Product IDs must be unique.");
  }

  const productIndex = new Map(
    products.map((product) => [product.id, product]),
  );

  return productIds.map((id) => {
    const product = productIndex.get(id);

    if (!product) {
      throw new Error(
        `[ProductExperience] Unknown product "${id}" for locale "${locale}".`,
      );
    }

    if (!allowDrafts && product.status !== "published") {
      throw new Error(`[ProductExperience] Product "${id}" is not published.`);
    }

    return product;
  });
}

export function resolveInlineExperienceProducts(
  products: ExperienceProduct[] | undefined,
): ExperienceProduct[] {
  if (!products?.length) {
    throw new Error("[ProductExperience] No products configured.");
  }

  return products;
}
