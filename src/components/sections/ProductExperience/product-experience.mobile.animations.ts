"use client";

import { gsap } from "@/lib/animation/gsap";

type NavigationDirection = -1 | 1;

const CONFIG = {
  bottleDuration: 0.85,
  headingDuration: 0.65,
  highlightDuration: 0.55,
  stagger: 0.09,

  ease: {
    bottle: "power3.out",
    content: "power2.out",
  },
} as const;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function animateMobileProduct(
  root: HTMLElement,
  direction: NavigationDirection,
) {
  if (prefersReducedMotion()) {
    return;
  }

  const select = (selector: string) =>
    gsap.utils.toArray<HTMLElement>(selector, root);

  const bottle = select("[data-mobile-active-bottle]");

  const volume = select("[data-mobile-volume]");

  const heading = select("[data-mobile-active-heading]");

  const highlights = select("[data-mobile-active-highlight]");

  const context = gsap.context(() => {
    /*
     * Initial animation states.
     */

    gsap.set(bottle, {
      autoAlpha: 0,
      x: direction * 45,
      y: 8,
      scale: 0.93,
      rotation: direction * 5,
      transformOrigin: "50% 50%",
    });

    gsap.set(volume, {
      opacity: 0,
      x: direction * 15,
    });

    gsap.set(heading, {
      autoAlpha: 0,
      y: 16,
    });

    gsap.set(highlights, {
      autoAlpha: 0,
      y: 12,
    });

    /*
     * Coordinated product transition.
     */

    const timeline = gsap.timeline({
      defaults: {
        overwrite: "auto",
      },
    });

    timeline.to(
      bottle,
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: CONFIG.bottleDuration,
        ease: CONFIG.ease.bottle,
      },
      0,
    );

    timeline.to(
      volume,
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: CONFIG.ease.content,
      },
      0.08,
    );

    timeline.to(
      heading,
      {
        autoAlpha: 1,
        y: 0,
        duration: CONFIG.headingDuration,
        ease: CONFIG.ease.content,
      },
      0.12,
    );

    if (highlights.length > 0) {
      timeline.to(
        highlights,
        {
          autoAlpha: 1,
          y: 0,
          duration: CONFIG.highlightDuration,
          stagger: CONFIG.stagger,
          ease: CONFIG.ease.content,
        },
        0.3,
      );
    }
  }, root);

  return () => {
    context.revert();
  };
}

/*
 * Initial mobile experience.
 *
 * Called by the main responsive animation engine.
 * Product navigation animations are handled separately.
 */

export function createMobileAnimation(root: HTMLElement) {
  if (prefersReducedMotion()) {
    return;
  }

  const header = root.querySelector<HTMLElement>("[data-mobile-header]");

  if (!header) {
    return;
  }

  const context = gsap.context(() => {
    gsap.fromTo(
      header,
      {
        opacity: 0.75,
        y: 8,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: "power2.out",
        overwrite: "auto",
      },
    );
  }, root);

  return () => {
    context.revert();
  };
}
