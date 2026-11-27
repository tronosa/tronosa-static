import type { Locale } from "@/i18n/config";

import type { LocalizedProduct } from "@/content/schemas/product.schema";

import type {
  ProductDetails,
  ProductDetailSection,
} from "@/components/products/ProductDetailsDialog";

import type { ProductLabels } from "./product-labels";

import { formatProductVolume } from "./product-filters";

export function toProductDetails(
  product: LocalizedProduct,
  locale: Locale,
  labels: ProductLabels,
): ProductDetails {
  const volume = formatProductVolume(product.volumeMl, locale);

  const sections: ProductDetailSection[] = [];

  if (product.declaration) {
    sections.push({
      id: "declaration",
      title: labels.information.declaration,
      description: product.declaration,
    });
  }

  if (product.storageInstructions) {
    sections.push({
      id: "storage",
      title: labels.information.storage,
      description: product.storageInstructions,
    });
  }

  if (product.availability) {
    sections.push({
      id: "availability",
      title: labels.information.availability,
      description: product.availability,
    });
  }

  return {
    title: `${product.title} — ${volume}`,

    description: product.description,

    facts: [
      {
        id: "volume",
        label: labels.facts.volume,
        value: volume,
      },
      {
        id: "water-type",
        label: labels.facts.waterType,
        value: labels.waterTypes[product.waterType],
      },
      {
        id: "category",
        label: labels.facts.category,
        value: labels.categories[product.category],
      },
    ],

    sections,
  };
}
