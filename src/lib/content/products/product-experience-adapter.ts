import type { Locale } from "@/i18n/config";

import type { LocalizedProduct } from "@/content/schemas/product.schema";

import type { ExperienceProduct } from "@/components/sections/ProductExperience/types";

import type { ProductLabels } from "./product-labels";

import { formatProductVolume } from "./product-filters";

export function toExperienceProduct(
  product: LocalizedProduct,
  locale: Locale,
  labels: ProductLabels,
): ExperienceProduct {
  const volume = formatProductVolume(product.volumeMl, locale);

  const highlights = product.highlights ?? [
    {
      id: "category",
      title: labels.facts.category,
      description: labels.categories[product.category],
    },
    {
      id: "water-type",
      title: labels.facts.waterType,
      description: labels.waterTypes[product.waterType],
    },
    {
      id: "volume",
      title: labels.facts.volume,
      description: volume,
    },
  ];

  return {
    id: product.id,

    title: product.title,

    volume,

    description: product.description,

    image: product.image,

    highlights,
  };
}
