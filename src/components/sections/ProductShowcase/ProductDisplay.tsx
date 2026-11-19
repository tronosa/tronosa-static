import Image from "next/image";

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

export function ProductDisplay({
  products,
  activeProductId,
}: ProductDisplayProps) {
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

      {products.map((product) => {
        const isActive = product.id === activeProductId;

        return (
          <div
            key={product.id}
            data-product-image
            data-active={isActive}
            aria-hidden={!isActive}
            className={productDisplayItemVariants({
              active: isActive,
            })}
          >
            <Image
              src={product.image.src}
              alt={product.image.alt}
              width={product.image.width}
              height={product.image.height}
              sizes="auto, 480px"
              quality={80}
              loading="lazy"
              draggable={false}
              className={productDisplayImageVariants()}
            />
          </div>
        );
      })}
    </div>
  );
}
