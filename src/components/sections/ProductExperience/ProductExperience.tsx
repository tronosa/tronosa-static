import "server-only";

import { getServerLocale } from "@/i18n/get-server-locale";

import { getEnvironment } from "@/lib/environment";

import { getAllProducts } from "@/lib/content/products/product-registry";

import { getProductLabels } from "@/lib/content/products/product-labels";

import { toExperienceProduct } from "@/lib/content/products/product-experience-adapter";

import {
  resolveExperienceProducts,
  resolveInlineExperienceProducts,
} from "@/lib/content/products/resolve-experience-products";

import { ProductExperienceClient } from "./ProductExperienceClient";

import type { ProductExperienceContent } from "./types";

export async function ProductExperience({
  productIds,
  products: inlineProducts,
  ...content
}: ProductExperienceContent) {
  if (!productIds) {
    return (
      <ProductExperienceClient
        {...content}
        products={resolveInlineExperienceProducts(inlineProducts)}
      />
    );
  }

  const locale = await getServerLocale();

  const { isProduction } = getEnvironment();

  const labels = await getProductLabels(locale);

  const products = resolveExperienceProducts(
    productIds,
    getAllProducts(locale),
    locale,
    !isProduction,
  ).map((product) => toExperienceProduct(product, locale, labels));

  return <ProductExperienceClient {...content} products={products} />;
}
