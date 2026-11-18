"use client";

import { useRef, type CSSProperties } from "react";

import { Section } from "@/components/ui/Section";
import { useGSAP } from "@/lib/animation/gsap";

import { ProductStage } from "./ProductStage";
import { ProductReveal } from "./ProductReveal";
import { ProductHighlights } from "./ProductHighlights";
import { ProductComposition } from "./ProductComposition";
import { ProductCollection } from "./ProductCollection";
import { ProductExperienceMobile } from "./ProductExperienceMobile";

import { createProductExperienceAnimation } from "./product-experience.animations";

import {
  productExperienceVariants,
  experienceViewportVariants,
  experienceDesktopVariants,
  experienceAmbientVariants,
  experienceGlowVariants,
  experienceBackgroundTextVariants,
  experienceContentVariants,
  experienceProgressVariants,
  experienceProgressBarVariants,
} from "./product-experience.variants";

import type { ProductExperienceProps } from "./types";

export function ProductExperienceClient(props: ProductExperienceProps) {
  const { appearance, reveal, composition, collection, products } = props;

  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;

      if (!container) {
        return;
      }

      return createProductExperienceAnimation(container, appearance);
    },
    {
      scope: containerRef,

      dependencies: [
        appearance.backgroundColor,
        appearance.secondaryBackgroundColor,
        products,
        reveal,
        composition,
        collection,
      ],

      revertOnUpdate: true,
    },
  );

  const styles = {
    "--experience-background": appearance.backgroundColor,

    "--experience-secondary-background": appearance.secondaryBackgroundColor,

    "--experience-accent": appearance.accentColor,

    "--experience-height": "calc(100svh - var(--site-header-height, 0px))",
  } as CSSProperties;

  return (
    <Section
      ref={containerRef}
      spacing="none"
      style={styles}
      className={productExperienceVariants()}
    >
      <div data-experience-viewport className={experienceViewportVariants()}>
        <div data-experience-desktop className={experienceDesktopVariants()}>
          <div aria-hidden="true" className={experienceAmbientVariants()}>
            <div data-experience-glow className={experienceGlowVariants()} />

            <span
              data-experience-background-text
              className={experienceBackgroundTextVariants()}
            >
              {reveal.backgroundText}
            </span>
          </div>

          <ProductStage products={products} />

          <div className={experienceContentVariants()}>
            <ProductReveal {...reveal} />

            <ProductHighlights products={products} />

            <ProductComposition {...composition} />

            <ProductCollection {...collection} />
          </div>

          <div aria-hidden="true" className={experienceProgressVariants()}>
            <div
              data-experience-progress-bar
              className={experienceProgressBarVariants()}
            />
          </div>
        </div>

        <ProductExperienceMobile {...props} />
      </div>
    </Section>
  );
}
