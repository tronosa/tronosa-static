export const PRODUCT_CATEGORIES = [
  "still",
  "sparkling",
  "sport",
  "kids",
  "large-format",
] as const;

export const PRODUCT_WATER_TYPES = ["still", "sparkling"] as const;

export const PRODUCT_STATUSES = ["draft", "published"] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export type ProductWaterType = (typeof PRODUCT_WATER_TYPES)[number];

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];
