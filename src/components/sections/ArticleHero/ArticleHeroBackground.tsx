import {
  articleHeroBackgroundVariants,
  articleHeroRingVariants,
  articleHeroBackgroundTextContainerVariants,
  articleHeroBackgroundTextVariants,
} from "./article-hero.variants";

import type { ArticleHeroBackgroundProps } from "./types";

const rings = Array.from({ length: 8 }, (_, index) => 220 + index * 140);

export function ArticleHeroBackground({
  backgroundText,
}: ArticleHeroBackgroundProps) {
  return (
    <div aria-hidden="true" className={articleHeroBackgroundVariants()}>
      {rings.map((size) => (
        <div
          key={size}
          className={articleHeroRingVariants()}
          style={{
            width: size,
            height: size,
          }}
        />
      ))}

      <div className={articleHeroBackgroundTextContainerVariants()}>
        <span className={articleHeroBackgroundTextVariants()}>
          {backgroundText}
        </span>
      </div>
    </div>
  );
}
