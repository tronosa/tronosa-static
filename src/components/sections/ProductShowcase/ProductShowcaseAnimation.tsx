"use client";

import type { RefObject } from "react";

import { useGSAP } from "@/lib/animation/gsap";

import {
  animateProductShowcase,
  type ProductShowcaseDirection,
} from "./product-showcase.animations";

type ProductShowcaseAnimationProps = {
  containerRef: RefObject<HTMLElement | null>;
  activeProductId: string;
  directionRef: RefObject<ProductShowcaseDirection>;
};

export function ProductShowcaseAnimation({
  containerRef,
  activeProductId,
  directionRef,
}: ProductShowcaseAnimationProps) {
  useGSAP(
    () => {
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
      dependencies: [activeProductId],
      revertOnUpdate: true,
    },
  );

  return null;
}
