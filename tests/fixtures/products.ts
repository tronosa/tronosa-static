import type { LocalizedProduct } from "@/content/schemas/product.schema";

import type { ProductLabels } from "@/lib/content/products/product-labels";

export const productLabelsFixture: ProductLabels = {
  facts: {
    volume: "Test volume",
    waterType: "Test water type",
    category: "Test category",
  },

  waterTypes: {
    still: "Test still",
    sparkling: "Test sparkling",
  },

  categories: {
    still: "Test still category",
    sparkling: "Test sparkling category",
    sport: "Test sport category",
    kids: "Test kids category",
    "large-format": "Test large format category",
  },

  information: {
    declaration: "Test declaration label",
    storage: "Test storage label",
    availability: "Test availability label",
  },

  dialog: {
    eyebrow: "Test product information",
    trigger: "Test details trigger",
    close: "Test close",
  },
};

export const productFixture: LocalizedProduct = {
  id: "test-product",

  slug: "test-product",

  category: "still",

  waterType: "still",

  status: "published",

  volumeMl: 750,

  featured: false,

  sortOrder: 10,

  title: "Test product",

  description: "Test product description",

  image: {
    src: "/test/product.webp",
    alt: "Test product packaging",
    width: 600,
    height: 1200,
  },

  appearance: {
    backgroundColor: "#DCEBF0",
    accentColor: "#214C60",
  },

  seo: {
    title: "Test product",
    description: "Test SEO description",
  },
};
