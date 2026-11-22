"use client";

import dynamic from "next/dynamic";
import { useId, useRef, useState, type CSSProperties } from "react";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { ProductDisplay } from "./ProductDisplay";
import { ProductSelector } from "./ProductSelector";
import { ProductShowcaseCTA } from "./ProductShowcaseCTA";

import type { ProductShowcaseDirection } from "./product-showcase.animations";

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

import type { ProductShowcaseClientProps } from "./types";

const PRODUCT_CHANGE_INTERVAL = 450;

const ProductShowcaseAnimation = dynamic(
  () =>
    import("./ProductShowcaseAnimation").then(
      (module) => module.ProductShowcaseAnimation,
    ),
  {
    ssr: false,
  },
);

export function ProductShowcaseClient({
  eyebrow,
  title,
  description,
  backgroundText,
  accessibility,
  cta,
  products,
}: ProductShowcaseClientProps) {
  const headingId = useId();

  const containerRef = useRef<HTMLElement>(null);

  const directionRef = useRef<ProductShowcaseDirection>(1);

  const lastChangeRef = useRef(-Infinity);

  const [activeProductId, setActiveProductId] = useState(products[0]?.id ?? "");

  const [hasInteracted, setHasInteracted] = useState(false);

  const activeProduct =
    products.find(({ id }) => id === activeProductId) ?? products[0];

  if (!activeProduct) {
    return null;
  }

  function handleProductChange(id: string) {
    if (id === activeProductId) {
      return;
    }

    const now = performance.now();

    if (now - lastChangeRef.current < PRODUCT_CHANGE_INTERVAL) {
      return;
    }

    const currentIndex = products.findIndex(
      (product) => product.id === activeProductId,
    );

    const nextIndex = products.findIndex((product) => product.id === id);

    if (nextIndex === -1) {
      return;
    }

    directionRef.current = nextIndex > currentIndex ? 1 : -1;

    lastChangeRef.current = now;

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
      {hasInteracted && (
        <ProductShowcaseAnimation
          containerRef={containerRef}
          activeProductId={activeProduct.id}
          directionRef={directionRef}
        />
      )}

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

      <Container size="wide">
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
            <div
              data-product-volume
              className={productShowcaseVolumeVariants()}
            >
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

        {cta && <ProductShowcaseCTA {...cta} />}
      </Container>
    </Section>
  );
}
