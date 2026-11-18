"use client";

import { useId, useRef, useState, type CSSProperties } from "react";

import { gsap, useGSAP } from "@/lib/animation/gsap";
import { animationConfig } from "@/lib/animation/config";

import { ProductDisplay } from "./ProductDisplay";
import { ProductSelector } from "./ProductSelector";

import {
  productShowcaseVariants,
  productShowcaseBackgroundVariants,
  productShowcaseBackgroundTextContainerVariants,
  productShowcaseBackgroundTextVariants,
  productShowcaseLayoutVariants,
  productShowcaseHeaderVariants,
  productShowcaseEyebrowVariants,
  productShowcaseTitleVariants,
  productShowcaseDescriptionVariants,
  productShowcaseDisplayContainerVariants,
  productShowcaseSelectorContainerVariants,
  productShowcaseInformationContainerVariants,
  productShowcaseVolumeVariants,
  productShowcaseInformationVariants,
  productShowcaseProductTitleVariants,
  productShowcaseProductDescriptionVariants,
} from "./product-showcase.variants";

import type { ProductShowcaseProps } from "./types";
import { Section } from "@/components/ui/Section";

export function ProductShowcaseClient({
  eyebrow,
  title,
  description,
  backgroundText,
  accessibility,
  products,
}: ProductShowcaseProps) {
  const headingId = useId();
  const containerRef = useRef<HTMLElement>(null);

  const [activeProductId, setActiveProductId] = useState(products[0]?.id ?? "");

  const [hasInteracted, setHasInteracted] = useState(false);

  const activeProduct =
    products.find(({ id }) => id === activeProductId) ?? products[0];

  useGSAP(
    () => {
      if (!hasInteracted) {
        return;
      }

      const media = gsap.matchMedia();

      media.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          const timeline = gsap.timeline({
            defaults: {
              ease: animationConfig.ease.enter,
              overwrite: "auto",
            },
          });

          timeline
            .fromTo(
              '[data-product-image][data-active="true"]',
              {
                y: 30,
                scale: 0.94,
                rotation: -3,
                opacity: 0.5,
              },
              {
                y: 0,
                scale: 1,
                rotation: 0,
                opacity: 1,
                duration: 0.75,
                clearProps: "transform,opacity",
              },
              0,
            )
            .fromTo(
              "[data-product-information]",
              {
                y: 14,
                opacity: 0.5,
              },
              {
                y: 0,
                opacity: 1,
                duration: 0.5,
                clearProps: "transform,opacity",
              },
              0.05,
            )
            .fromTo(
              "[data-product-volume]",
              {
                y: 16,
                opacity: 0.5,
              },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                clearProps: "transform,opacity",
              },
              0.1,
            );
        },
        containerRef,
      );

      return () => media.revert();
    },
    {
      scope: containerRef,
      dependencies: [activeProductId, hasInteracted],
      revertOnUpdate: true,
    },
  );

  if (!activeProduct) {
    return null;
  }

  function handleProductChange(id: string) {
    if (id === activeProductId) {
      return;
    }

    setHasInteracted(true);
    setActiveProductId(id);
  }

  const appearance = {
    "--product-background": activeProduct.appearance.backgroundColor,

    "--product-accent": activeProduct.appearance.accentColor,
  } as CSSProperties;

  return (
    <Section
      spacingType="padding"
      ref={containerRef}
      aria-labelledby={headingId}
      style={appearance}
      className={productShowcaseVariants()}
    >
      <div aria-hidden="true" className={productShowcaseBackgroundVariants()} />

      {backgroundText && (
        <div
          aria-hidden="true"
          className={productShowcaseBackgroundTextContainerVariants()}
        >
          <span className={productShowcaseBackgroundTextVariants()}>
            {backgroundText}
          </span>
        </div>
      )}

      <div className={productShowcaseLayoutVariants()}>
        <header className={productShowcaseHeaderVariants()}>
          {eyebrow && (
            <p className={productShowcaseEyebrowVariants()}>{eyebrow}</p>
          )}

          <h2 id={headingId} className={productShowcaseTitleVariants()}>
            {title}
          </h2>

          {description && (
            <p className={productShowcaseDescriptionVariants()}>
              {description}
            </p>
          )}
        </header>

        <div className={productShowcaseDisplayContainerVariants()}>
          <ProductDisplay
            products={products}
            activeProductId={activeProduct.id}
          />
        </div>

        <div className={productShowcaseSelectorContainerVariants()}>
          <ProductSelector
            products={products}
            activeProductId={activeProduct.id}
            label={accessibility.selectorLabel}
            onChange={handleProductChange}
          />
        </div>

        <div
          aria-live="polite"
          aria-atomic="true"
          className={productShowcaseInformationContainerVariants()}
        >
          <div data-product-volume className={productShowcaseVolumeVariants()}>
            {activeProduct.volume}
          </div>

          <div
            data-product-information
            className={productShowcaseInformationVariants()}
          >
            <h3 className={productShowcaseProductTitleVariants()}>
              {activeProduct.title}
            </h3>

            <p className={productShowcaseProductDescriptionVariants()}>
              {activeProduct.description}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
