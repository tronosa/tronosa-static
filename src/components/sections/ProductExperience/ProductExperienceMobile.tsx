"use client";

import Image from "next/image";

import { useRef, useState, type PointerEvent } from "react";

import { useGSAP } from "@/lib/animation/gsap";

import { ProductComposition } from "./ProductComposition";

import { animateMobileProduct } from "./product-experience.mobile.animations";

import {
  mobileExperienceVariants,
  mobileExperienceShowcaseVariants,
  mobileExperienceContainerVariants,
  mobileExperienceHeaderVariants,
  mobileExperienceLabelVariants,
  mobileExperienceCounterVariants,
  mobileExperienceStageVariants,
  mobileExperienceGlowVariants,
  mobileExperienceRingVariants,
  mobileExperienceBackgroundTextVariants,
  mobileExperienceWatermarkVariants,
  mobileExperienceBottleVariants,
  mobileExperienceImageVariants,
  mobileExperienceNavigationVariants,
  mobileExperienceTabVariants,
  mobileExperienceContentVariants,
  mobileExperienceEyebrowVariants,
  mobileExperienceTitleVariants,
  mobileExperienceDescriptionVariants,
  mobileExperienceHighlightsVariants,
  mobileExperienceHighlightVariants,
  mobileExperienceHighlightIndexVariants,
  mobileExperienceHighlightTitleVariants,
  mobileExperienceHighlightDescriptionVariants,
  mobileExperienceProgressVariants,
  mobileExperienceProgressItemVariants,
  mobileExperienceCompositionVariants,
  mobileExperienceCompositionInnerVariants,
} from "./product-experience.mobile.variants";

import type { ProductExperienceProps } from "./types";

type NavigationDirection = -1 | 1;

interface SwipePosition {
  x: number;
  y: number;
  pointerId: number;
}

const SWIPE_THRESHOLD = 50;

export function ProductExperienceMobile({
  reveal,
  products,
  composition,
  collection,
}: ProductExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const navigationRef = useRef<HTMLDivElement>(null);

  const swipePositionRef = useRef<SwipePosition | null>(null);

  const directionRef = useRef<NavigationDirection>(1);

  const previousProductRef = useRef<string | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const productCount = products.length;

  const currentIndex = Math.min(activeIndex, Math.max(0, productCount - 1));

  const activeProduct = products[currentIndex];

  const activeProductId = activeProduct?.id;

  /*
   * Animate product changes.
   */

  useGSAP(
    () => {
      const container = containerRef.current;

      if (!container || !activeProductId) {
        return;
      }

      const previousProduct = previousProductRef.current;

      previousProductRef.current = activeProductId;

      if (previousProduct === null || previousProduct === activeProductId) {
        return;
      }

      return animateMobileProduct(container, directionRef.current);
    },
    {
      scope: containerRef,
      dependencies: [activeProductId],
      revertOnUpdate: true,
    },
  );

  if (!activeProduct) {
    return null;
  }

  /*
   * Product navigation.
   */

  function selectProduct(index: number) {
    if (index < 0 || index >= productCount || index === currentIndex) {
      return;
    }

    directionRef.current = index > currentIndex ? 1 : -1;

    setActiveIndex(index);

    /*
     * Keep the selected product button visible
     * without scrolling the entire document.
     */

    const navigation = navigationRef.current;

    const button = navigation?.children.item(index);

    if (navigation && button instanceof HTMLElement) {
      const navigationRect = navigation.getBoundingClientRect();

      const buttonRect = button.getBoundingClientRect();

      const offset =
        buttonRect.left -
        navigationRect.left -
        (navigation.clientWidth - buttonRect.width) / 2;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      navigation.scrollTo({
        left: navigation.scrollLeft + offset,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }
  }

  /*
   * Horizontal swipe navigation.
   */

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch" || !event.isPrimary || productCount < 2) {
      return;
    }

    swipePositionRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    };
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = swipePositionRef.current;

    swipePositionRef.current = null;

    if (!start || start.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - start.x;

    const deltaY = event.clientY - start.y;

    const isHorizontalSwipe =
      Math.abs(deltaX) >= SWIPE_THRESHOLD &&
      Math.abs(deltaX) > Math.abs(deltaY) * 1.5;

    if (!isHorizontalSwipe) {
      return;
    }

    selectProduct(currentIndex + (deltaX < 0 ? 1 : -1));
  }

  function handlePointerCancel() {
    swipePositionRef.current = null;
  }

  return (
    <div
      ref={containerRef}
      data-experience-mobile
      className={mobileExperienceVariants()}
    >
      <div
        className={mobileExperienceShowcaseVariants({
          appearance: currentIndex % 2 === 0 ? "primary" : "secondary",
        })}
      >
        <div className={mobileExperienceContainerVariants()}>
          {/* Collection header */}

          <header
            data-mobile-header
            className={mobileExperienceHeaderVariants()}
          >
            <span className={mobileExperienceLabelVariants()}>
              {collection.eyebrow ?? collection.title}
            </span>

            <span
              aria-live="polite"
              className={mobileExperienceCounterVariants()}
            >
              {String(currentIndex + 1).padStart(2, "0")}
              {" / "}
              {String(productCount).padStart(2, "0")}
            </span>
          </header>

          {/* Product stage */}

          <div
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            className={mobileExperienceStageVariants()}
          >
            <div
              aria-hidden="true"
              className={mobileExperienceGlowVariants()}
            />

            <div
              aria-hidden="true"
              className={mobileExperienceRingVariants({
                size: "outer",
              })}
            />

            <div
              aria-hidden="true"
              className={mobileExperienceRingVariants({
                size: "inner",
              })}
            />

            <span
              aria-hidden="true"
              className={mobileExperienceBackgroundTextVariants()}
            >
              {reveal.backgroundText}
            </span>

            <span
              key={`volume-${activeProduct.id}`}
              aria-hidden="true"
              data-mobile-volume
              className={mobileExperienceWatermarkVariants()}
            >
              {activeProduct.volume}
            </span>

            <div
              key={`bottle-${activeProduct.id}`}
              data-mobile-active-bottle
              className={mobileExperienceBottleVariants()}
            >
              <Image
                src={activeProduct.image.src}
                alt={activeProduct.image.alt}
                width={activeProduct.image.width}
                height={activeProduct.image.height}
                sizes="(max-width: 639px) 65vw, 320px"
                loading="eager"
                draggable={false}
                className={mobileExperienceImageVariants()}
              />
            </div>
          </div>

          {/* Product navigation */}

          {productCount > 1 && (
            <div
              ref={navigationRef}
              role="group"
              aria-label={collection.title}
              className={mobileExperienceNavigationVariants()}
            >
              {products.map((product, index) => (
                <button
                  key={product.id}
                  type="button"
                  aria-pressed={index === currentIndex}
                  onClick={() => selectProduct(index)}
                  className={mobileExperienceTabVariants({
                    active: index === currentIndex,
                  })}
                >
                  {product.volume}
                </button>
              ))}
            </div>
          )}

          {/* Active product content */}

          <article
            key={`content-${activeProduct.id}`}
            className={mobileExperienceContentVariants()}
          >
            <header data-mobile-active-heading>
              {activeProduct.eyebrow && (
                <p className={mobileExperienceEyebrowVariants()}>
                  {activeProduct.eyebrow}
                </p>
              )}

              <h2 className={mobileExperienceTitleVariants()}>
                {activeProduct.title}
              </h2>

              {activeProduct.description && (
                <p className={mobileExperienceDescriptionVariants()}>
                  {activeProduct.description}
                </p>
              )}
            </header>

            <ul className={mobileExperienceHighlightsVariants()}>
              {activeProduct.highlights.map((highlight, index) => (
                <li
                  key={highlight.id}
                  data-mobile-active-highlight
                  className={mobileExperienceHighlightVariants()}
                >
                  <span
                    aria-hidden="true"
                    className={mobileExperienceHighlightIndexVariants()}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3 className={mobileExperienceHighlightTitleVariants()}>
                      {highlight.title}
                    </h3>

                    <p
                      className={mobileExperienceHighlightDescriptionVariants()}
                    >
                      {highlight.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          {/* Collection progress */}

          {productCount > 1 && (
            <div
              aria-hidden="true"
              className={mobileExperienceProgressVariants()}
            >
              {products.map((product, index) => (
                <span
                  key={product.id}
                  className={mobileExperienceProgressItemVariants({
                    active: currentIndex === index,
                  })}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Shared mineral composition */}

      <div className={mobileExperienceCompositionVariants()}>
        <div className={mobileExperienceCompositionInnerVariants()}>
          <ProductComposition {...composition} />
        </div>
      </div>
    </div>
  );
}
