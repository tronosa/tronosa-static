"use client";

import {
  productCategorySelectorVariants,
  productCategorySelectorLabelVariants,
  productCategorySelectorListVariants,
  productCategorySelectorButtonVariants,
} from "./product-showcase.variants";

import type { ProductShowcaseCategory } from "./types";

type ProductCategorySelectorProps = {
  categories: ProductShowcaseCategory[];
  activeCategoryId: string;
  label: string;
  onChange: (categoryId: string) => void;
};

export function ProductCategorySelector({
  categories,
  activeCategoryId,
  label,
  onChange,
}: ProductCategorySelectorProps) {
  return (
    <div className={productCategorySelectorVariants()}>
      <p className={productCategorySelectorLabelVariants()}>{label}</p>

      <div
        role="group"
        aria-label={label}
        className={productCategorySelectorListVariants()}
      >
        {categories.map((category) => {
          const isActive = category.id === activeCategoryId;

          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(category.id)}
              className={productCategorySelectorButtonVariants({
                active: isActive,
              })}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
