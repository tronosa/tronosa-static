"use client";

import Image from "next/image";
import { useId } from "react";

import {
  productSelectorVariants,
  productSelectorOptionsVariants,
  productSelectorCardVariants,
  productSelectorImageVariants,
  productSelectorVolumeVariants,
  productSelectorInputVariants,
} from "./product-selector.variants";

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
    <div
      role="radiogroup"
      aria-label={label}
      className={productSelectorVariants()}
    >
      <div className={productSelectorOptionsVariants()}>
        {products.map((product) => {
          const isActive = product.id === activeProductId;

          return (
            <label
              key={product.id}
              className={productSelectorCardVariants({
                active: isActive,
              })}
            >
              <input
                type="radio"
                name={groupId}
                value={product.id}
                checked={isActive}
                onChange={() => onChange(product.id)}
                className={productSelectorInputVariants()}
              />

              <Image
                src={product.image.src}
                alt=""
                width={product.image.width}
                height={product.image.height}
                sizes="auto, 64px"
                quality={65}
                loading="lazy"
                draggable={false}
                className={productSelectorImageVariants()}
              />

              <span className={productSelectorVolumeVariants()}>
                {product.volume}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
