"use client";

import { useId } from "react";
import Image from "next/image";

import {
  productSelectorVariants,
  productSelectorLegendVariants,
  productSelectorOptionsVariants,
  productSelectorOptionVariants,
  productSelectorInputVariants,
  productSelectorCardVariants,
  productSelectorImageVariants,
  productSelectorVolumeVariants,
} from "./product-showcase.variants";

import type { ShowcaseProduct } from "./types";

interface ProductSelectorProps {
  products: ShowcaseProduct[];
  activeProductId: string;
  label: string;
  onChange: (id: string) => void;
}

export function ProductSelector({
  products,
  activeProductId,
  label,
  onChange,
}: ProductSelectorProps) {
  const groupId = useId();

  return (
    <fieldset className={productSelectorVariants()}>
      <legend className={productSelectorLegendVariants()}>{label}</legend>

      <div className={productSelectorOptionsVariants()}>
        {products.map((product) => {
          const isActive = activeProductId === product.id;

          return (
            <label key={product.id} className={productSelectorOptionVariants()}>
              <input
                type="radio"
                name={groupId}
                value={product.id}
                checked={isActive}
                onChange={() => onChange(product.id)}
                className={productSelectorInputVariants()}
              />

              <span
                className={productSelectorCardVariants({
                  active: isActive,
                })}
              >
                <Image
                  src={product.image.src}
                  alt=""
                  aria-hidden="true"
                  width={product.image.width}
                  height={product.image.height}
                  sizes="64px"
                  loading="lazy"
                  draggable={false}
                  className={productSelectorImageVariants()}
                />

                <span className={productSelectorVolumeVariants()}>
                  {product.volume}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
