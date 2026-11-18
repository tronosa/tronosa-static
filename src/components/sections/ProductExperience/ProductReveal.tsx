import {
  experienceSceneVariants,
  experienceEyebrowVariants,
  experienceTitleVariants,
  experienceDescriptionVariants,
  experienceScrollIndicatorVariants,
  experienceScrollIndicatorLineVariants,
} from "./product-experience.variants";

import type { ProductRevealProps } from "./types";

export function ProductReveal({
  eyebrow,
  title,
  description,
  scrollLabel,
}: ProductRevealProps) {
  return (
    <div
      data-experience-scene="reveal"
      className={experienceSceneVariants({
        alignment: "center",
      })}
    >
      {eyebrow && <p className={experienceEyebrowVariants()}>{eyebrow}</p>}

      <h2
        className={experienceTitleVariants({
          size: "hero",
        })}
      >
        {title}
      </h2>

      {description && (
        <p className={experienceDescriptionVariants()}>{description}</p>
      )}

      <div
        aria-hidden="true"
        data-experience-scroll-indicator
        className={experienceScrollIndicatorVariants()}
      >
        <span>{scrollLabel}</span>

        <span className={experienceScrollIndicatorLineVariants()} />
      </div>
    </div>
  );
}
