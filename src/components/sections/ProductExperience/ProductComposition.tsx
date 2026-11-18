import {
  experienceSceneVariants,
  experienceCompositionContentVariants,
  experienceEyebrowVariants,
  experienceTitleVariants,
  experienceDescriptionVariants,
  experienceMineralsVariants,
  experienceMineralVariants,
  experienceMineralSymbolVariants,
  experienceMineralNameVariants,
  experienceMineralValueVariants,
} from "./product-experience.variants";

import type { ProductCompositionProps } from "./types";

export function ProductComposition({
  eyebrow,
  title,
  description,
  minerals,
}: ProductCompositionProps) {
  return (
    <div
      data-experience-scene="composition"
      className={experienceSceneVariants({
        alignment: "left",
      })}
    >
      <div className={experienceCompositionContentVariants()}>
        {eyebrow && <p className={experienceEyebrowVariants()}>{eyebrow}</p>}

        <h2 className={experienceTitleVariants()}>{title}</h2>

        {description && (
          <p className={experienceDescriptionVariants()}>{description}</p>
        )}
      </div>

      {minerals.length > 0 && (
        <ul className={experienceMineralsVariants()}>
          {minerals.map((mineral) => (
            <li
              key={mineral.id}
              data-experience-mineral
              className={experienceMineralVariants()}
            >
              <span
                aria-hidden="true"
                className={experienceMineralSymbolVariants()}
              >
                {mineral.symbol}
              </span>

              <span className={experienceMineralNameVariants()}>
                {mineral.name}
              </span>

              {mineral.value && (
                <span className={experienceMineralValueVariants()}>
                  {mineral.value} {mineral.unit}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
