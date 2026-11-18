import Image from "next/image";

import {
  experienceStageVariants,
  experienceRingVariants,
  experienceBottleVariants,
  experienceBottleMotionVariants,
  experienceBottleImageVariants,
  experienceBottleCaptionVariants,
} from "./product-experience.variants";

import type { ProductStageProps } from "./types";

export function ProductStage({ products }: ProductStageProps) {
  return (
    <div data-experience-stage className={experienceStageVariants()}>
      <div
        aria-hidden="true"
        data-experience-ring="outer"
        className={experienceRingVariants({
          size: "outer",
        })}
      />

      <div
        aria-hidden="true"
        data-experience-ring="inner"
        className={experienceRingVariants({
          size: "inner",
        })}
      />

      {products.map((product, index) => (
        <figure
          key={product.id}
          data-experience-product={product.id}
          className={experienceBottleVariants()}
        >
          <div
            data-experience-bottle={product.id}
            data-product-index={index}
            className={experienceBottleMotionVariants()}
          >
            <Image
              src={product.image.src}
              alt={product.image.alt}
              width={product.image.width}
              height={product.image.height}
              sizes="(max-width: 1023px) 45vw, 400px"
              loading={products.length <= 6 || index < 2 ? "eager" : "lazy"}
              draggable={false}
              className={experienceBottleImageVariants()}
            />
          </div>

          <figcaption className={experienceBottleCaptionVariants()}>
            {product.title} — {product.volume}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
