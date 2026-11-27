import "server-only";

import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/config";

import {
  PRODUCT_CATEGORIES,
  PRODUCT_WATER_TYPES,
  type ProductCategory,
  type ProductWaterType,
} from "./product.config";

export type ProductLabels = {
  facts: {
    volume: string;
    waterType: string;
    category: string;
  };

  waterTypes: Record<ProductWaterType, string>;

  categories: Record<ProductCategory, string>;

  information: {
    declaration: string;
    storage: string;
    availability: string;
  };

  dialog: {
    eyebrow: string;
    trigger: string;
    close: string;
  };
};

export type ProductCatalogLabels = {
  waterType: string;
  volume: string;
  allWaterTypes: string;
  allVolumes: string;
  reset: string;
  empty: string;
  preview: string;
  resultsByCount: string[];
  waterTypes: Record<ProductWaterType, string>;
};

export async function getProductLabels(locale: Locale): Promise<ProductLabels> {
  const t = await getTranslations({
    locale,
    namespace: "Products",
  });

  const waterTypes = Object.fromEntries(
    PRODUCT_WATER_TYPES.map((type) => [type, t(`waterTypes.${type}`)]),
  ) as Record<ProductWaterType, string>;

  const categories = Object.fromEntries(
    PRODUCT_CATEGORIES.map((category) => [
      category,
      t(`categories.${category}`),
    ]),
  ) as Record<ProductCategory, string>;

  return {
    facts: {
      volume: t("facts.volume"),
      waterType: t("facts.waterType"),
      category: t("facts.category"),
    },

    waterTypes,

    categories,

    information: {
      declaration: t("information.declaration"),
      storage: t("information.storage"),
      availability: t("information.availability"),
    },

    dialog: {
      eyebrow: t("dialog.eyebrow"),
      trigger: t("dialog.trigger"),
      close: t("dialog.close"),
    },
  };
}

export async function getProductCatalogLabels(
  locale: Locale,
  productCount: number,
): Promise<ProductCatalogLabels> {
  const t = await getTranslations({
    locale,
    namespace: "Products",
  });

  return {
    waterType: t("catalog.waterType"),
    volume: t("catalog.volume"),
    allWaterTypes: t("catalog.allWaterTypes"),
    allVolumes: t("catalog.allVolumes"),
    reset: t("catalog.reset"),
    empty: t("catalog.empty"),
    preview: t("catalog.preview"),

    resultsByCount: Array.from({ length: productCount + 1 }, (_, count) =>
      t("catalog.results", { count }),
    ),

    waterTypes: {
      still: t("waterTypes.still"),
      sparkling: t("waterTypes.sparkling"),
    },
  };
}

export async function getProductDialogTriggerLabel(
  locale: Locale,
  product: string,
): Promise<string> {
  const t = await getTranslations({
    locale,
    namespace: "Products.dialog",
  });

  return t("triggerAccessible", { product });
}
