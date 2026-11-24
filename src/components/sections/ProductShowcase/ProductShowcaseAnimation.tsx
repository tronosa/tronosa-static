"use client";

import { useEffect, type RefObject } from "react";

import { useGSAP } from "@/lib/animation/gsap";

import {
  animateProductShowcase,
  type ProductShowcaseDirection,
} from "./product-showcase.animations";

type ProductShowcaseAnimationProps = {
  containerRef: RefObject<HTMLElement | null>;
  activeProductId: string;
  directionRef: RefObject<ProductShowcaseDirection>;
  enabled: boolean;
  onReady: () => void;
};

export function ProductShowcaseAnimation({
  containerRef,
  activeProductId,
  directionRef,
  enabled,
  onReady,
}: ProductShowcaseAnimationProps) {
  useGSAP(
    () => {
      if (!enabled) {
        return;
      }

      const container = containerRef.current;

      if (!container) {
        return;
      }

      const timeline = animateProductShowcase(container, directionRef.current);

      return () => {
        timeline?.kill();
      };
    },
    {
      scope: containerRef,
      dependencies: [activeProductId, enabled],
      revertOnUpdate: true,
    },
  );

  useEffect(() => {
    onReady();
  }, [onReady]);

  return null;
}
