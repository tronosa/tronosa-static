"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import { Section } from "@/components/ui/Section";

import { ProductStage } from "./ProductStage";
import { ProductReveal } from "./ProductReveal";
import { ProductHighlights } from "./ProductHighlights";
import { ProductComposition } from "./ProductComposition";
import { ProductCollection } from "./ProductCollection";
import { ProductExperienceMobile } from "./ProductExperienceMobile";

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

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px) and (min-height: 760px)";

const REDUCED_MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";

export function ProductExperienceClient(props: ProductExperienceProps) {
  const { appearance, reveal, composition, collection, products } = props;

  const { backgroundColor, secondaryBackgroundColor } = appearance;

  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const containerElement = containerRef.current;

    if (!containerElement) {
      return;
    }

    const container: HTMLElement = containerElement;

    const mobileElement = container.querySelector<HTMLElement>(
      "[data-experience-mobile]",
    );

    if (!mobileElement) {
      return;
    }

    const mobile: HTMLElement = mobileElement;

    const desktopMedia = window.matchMedia(DESKTOP_MEDIA_QUERY);

    const reducedMotionMedia = window.matchMedia(REDUCED_MOTION_MEDIA_QUERY);

    let disposed = false;
    let desktopControllerActive = false;
    let requestId = 0;

    let cleanupAnimation: (() => void) | undefined;

    function cleanup() {
      cleanupAnimation?.();
      cleanupAnimation = undefined;
    }

    function isCurrentRequest(currentRequestId: number) {
      return !disposed && currentRequestId === requestId;
    }

    function removeMediaListeners() {
      desktopMedia.removeEventListener("change", synchronize);

      reducedMotionMedia.removeEventListener("change", synchronize);
    }

    async function initializeMobile(currentRequestId: number) {
      try {
        const { createMobileAnimation } =
          await import("./product-experience.mobile.animations");

        if (!isCurrentRequest(currentRequestId) || reducedMotionMedia.matches) {
          return;
        }

        cleanupAnimation = createMobileAnimation(mobile);
      } catch (error: unknown) {
        if (!isCurrentRequest(currentRequestId)) {
          return;
        }

        console.error(
          "[ProductExperience] Mobile animation initialization failed.",
          error,
        );
      }
    }

    function synchronize() {
      if (disposed || desktopControllerActive) {
        return;
      }

      const currentRequestId = ++requestId;

      cleanup();

      if (reducedMotionMedia.matches) {
        return;
      }

      if (!desktopMedia.matches) {
        void initializeMobile(currentRequestId);

        return;
      }

      void import("./product-experience.animations")
        .then(({ createProductExperienceAnimation }) => {
          if (!isCurrentRequest(currentRequestId)) {
            return;
          }

          cleanupAnimation = createProductExperienceAnimation(container, {
            backgroundColor,
            secondaryBackgroundColor,
          });

          /*
           * The desktop engine owns responsive
           * behavior through gsap.matchMedia().
           */

          desktopControllerActive = true;

          removeMediaListeners();
        })
        .catch((error: unknown) => {
          if (!isCurrentRequest(currentRequestId)) {
            return;
          }

          console.error(
            "[ProductExperience] Animation initialization failed.",
            error,
          );

          void initializeMobile(currentRequestId);
        });
    }

    desktopMedia.addEventListener("change", synchronize);

    reducedMotionMedia.addEventListener("change", synchronize);

    synchronize();

    return () => {
      disposed = true;

      requestId++;

      removeMediaListeners();

      cleanup();
    };
  }, [
    backgroundColor,
    secondaryBackgroundColor,
    products,
    reveal,
    composition,
    collection,
  ]);

  const styles = {
    "--experience-background": appearance.backgroundColor,

    "--experience-secondary-background": appearance.secondaryBackgroundColor,

    "--experience-accent": appearance.accentColor,

    "--experience-height": "100svh",
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
