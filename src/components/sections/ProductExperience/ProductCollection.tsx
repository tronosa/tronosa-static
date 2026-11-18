import {
  experienceSceneVariants,
  experienceCollectionContentVariants,
  experienceEyebrowVariants,
  experienceTitleVariants,
  experienceDescriptionVariants,
} from "./product-experience.variants";

import type { ProductCollectionProps } from "./types";

export function ProductCollection({
  eyebrow,
  title,
  description,
}: ProductCollectionProps) {
  return (
    <div
      data-experience-scene="collection"
      className={experienceSceneVariants({
        alignment: "bottom",
      })}
    >
      <div className={experienceCollectionContentVariants()}>
        {eyebrow && <p className={experienceEyebrowVariants()}>{eyebrow}</p>}

        <h2 className={experienceTitleVariants()}>{title}</h2>

        {description && (
          <p className={experienceDescriptionVariants()}>{description}</p>
        )}
      </div>
    </div>
  );
}
