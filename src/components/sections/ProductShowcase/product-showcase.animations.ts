"use client";

import { gsap } from "@/lib/animation/gsap";

const CONFIG = {
  image: {
    duration: 0.85,
    distance: 48,
    scale: 0.96,
    rotation: 2,
    ease: "power3.out",
  },

  content: {
    duration: 0.65,
    opacity: 0,
    ease: "sine.inOut",
    stagger: 0.08,
  },
} as const;

export type ProductShowcaseDirection = -1 | 1;

export function animateProductShowcase(
  root: HTMLElement,
  direction: ProductShowcaseDirection,
) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const select = gsap.utils.selector(root);

  const image = select('[data-product-image][data-active="true"]');

  const information = select("[data-product-information]");

  const volume = select("[data-product-volume]");

  const content = [...volume, ...information];

  gsap.killTweensOf([...image, ...content]);

  const timeline = gsap.timeline({
    defaults: {
      overwrite: "auto",
    },
  });

  timeline.fromTo(
    image,
    {
      x: direction * CONFIG.image.distance,
      scale: CONFIG.image.scale,
      rotation: direction * CONFIG.image.rotation,
      opacity: 0.65,
    },
    {
      x: 0,
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: CONFIG.image.duration,
      ease: CONFIG.image.ease,
    },
    0,
  );

  timeline.fromTo(
    content,
    {
      opacity: CONFIG.content.opacity,
    },
    {
      opacity: 1,
      duration: CONFIG.content.duration,
      ease: CONFIG.content.ease,
      stagger: CONFIG.content.stagger,
    },
    0.1,
  );

  return timeline;
}
