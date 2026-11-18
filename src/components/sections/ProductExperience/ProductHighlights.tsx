import {
  experienceSceneVariants,
  experienceHighlightsContentVariants,
  experienceEyebrowVariants,
  experienceTitleVariants,
  experienceHighlightsListVariants,
  experienceHighlightItemVariants,
  experienceHighlightTitleVariants,
  experienceHighlightDescriptionVariants,
  experienceProductDetailVariants,
  experienceProductVolumeVariants,
  experienceProductDescriptionVariants,
} from "./product-experience.variants";

import type { ProductHighlightsProps } from "./types";

export function ProductHighlights({ products }: ProductHighlightsProps) {
  return (
    <div
      data-experience-scene="highlights"
      className={experienceSceneVariants({
        alignment: "left",
      })}
    >
      <div className={experienceHighlightsContentVariants()}>
        {products.map((product) => (
          <article
            key={product.id}
            data-experience-product-detail={product.id}
            className={experienceProductDetailVariants()}
          >
            {product.eyebrow && (
              <p className={experienceEyebrowVariants()}>{product.eyebrow}</p>
            )}

            <div className={experienceProductVolumeVariants()}>
              {product.volume}
            </div>

            <h2 className={experienceTitleVariants()}>{product.title}</h2>

            {product.description && (
              <p className={experienceProductDescriptionVariants()}>
                {product.description}
              </p>
            )}

            <ul className={experienceHighlightsListVariants()}>
              {product.highlights.map((highlight) => (
                <li
                  key={highlight.id}
                  data-experience-highlight
                  className={experienceHighlightItemVariants()}
                >
                  <h3 className={experienceHighlightTitleVariants()}>
                    {highlight.title}
                  </h3>

                  <p className={experienceHighlightDescriptionVariants()}>
                    {highlight.description}
                  </p>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
