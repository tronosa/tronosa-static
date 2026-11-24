"use client";

import Image from "next/image";
import { useState } from "react";

import {
  productDisplayVariants,
  productDisplayHaloVariants,
  productDisplayRingVariants,
  productDisplayShadowVariants,
  productDisplayItemVariants,
  productDisplayImageVariants,
} from "./product-showcase.variants";

import type { ShowcaseProduct } from "./types";

interface ProductDisplayProps {
  products: ShowcaseProduct[];
  activeProductId: string;
}

function ActiveProductImage({ product }: { product: ShowcaseProduct }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null;
  }

  return (
    <Image
      src={product.image.src}
      alt={product.image.alt}
      width={product.image.width}
      height={product.image.height}
      sizes="(max-width: 1023px) 80vw, 480px"
      quality={80}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={productDisplayImageVariants()}
      onError={() => setHasError(true)}
    />
  );
}

export function ProductDisplay({
  products,
  activeProductId,
}: ProductDisplayProps) {
  const product = products.find((item) => item.id === activeProductId);

  if (!product) {
    return null;
  }

  return (
    <div className={productDisplayVariants()}>
      <div aria-hidden="true" className={productDisplayHaloVariants()} />

      <div
        aria-hidden="true"
        className={productDisplayRingVariants({
          size: "outer",
        })}
      />

      <div
        aria-hidden="true"
        className={productDisplayRingVariants({
          size: "inner",
        })}
      />

      <div aria-hidden="true" className={productDisplayShadowVariants()} />

      <div
        key={product.id}
        data-product-image
        data-active="true"
        className={productDisplayItemVariants({
          active: true,
        })}
      >
        <ActiveProductImage product={product} />
      </div>
    </div>
  );
}
