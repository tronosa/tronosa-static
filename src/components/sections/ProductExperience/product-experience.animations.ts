"use client";

import { gsap } from "@/lib/animation/gsap";
import { ScrollTrigger } from "@/lib/animation/scroll-trigger";

import { createMobileAnimation } from "./product-experience.mobile.animations";

interface ProductExperienceAnimationOptions {
  backgroundColor: string;
  secondaryBackgroundColor: string;
}

const CONFIG = {
  revealDuration: 2,
  productDuration: 2.6,
  compositionDuration: 2.8,
  collectionDuration: 2.9,
  transitionDuration: 1.35,

  minimumViewportHeight: 620,
  maximumAnimatedProducts: 6,

  scrub: 1.2,
} as const;

export function createProductExperienceAnimation(
  root: HTMLElement,
  {
    backgroundColor,
    secondaryBackgroundColor,
  }: ProductExperienceAnimationOptions,
) {
  const viewport = root.querySelector<HTMLElement>(
    "[data-experience-viewport]",
  );

  const desktop = root.querySelector<HTMLElement>("[data-experience-desktop]");

  const mobile = root.querySelector<HTMLElement>("[data-experience-mobile]");

  if (!viewport || !desktop || !mobile) {
    return;
  }

  const select = (selector: string) =>
    gsap.utils.toArray<HTMLElement>(selector, desktop);

  const media = gsap.matchMedia();

  media.add(
    {
      desktop: "(min-width: 1024px) and (min-height: 760px)",

      mobile: "(max-width: 1023px), (max-height: 759px)",

      reducedMotion: "(prefers-reduced-motion: reduce)",
    },

    (context) => {
      const conditions = context.conditions;

      if (!conditions || conditions.reducedMotion) {
        return;
      }

      const bottles = select("[data-experience-bottle]");

      const productDetails = select("[data-experience-product-detail]");

      const productCount = bottles.length;

      /*
       * Mobile experience
       */

      if (
        !conditions.desktop ||
        conditions.mobile ||
        productCount === 0 ||
        productCount > CONFIG.maximumAnimatedProducts ||
        productDetails.length !== productCount
      ) {
        return createMobileAnimation(mobile);
      }

      /*
       * Desktop layout initialization
       */

      viewport.dataset.animated = "true";

      const scenes = select("[data-experience-scene]");

      const hasOverflow = scenes.some(
        (scene) => scene.scrollHeight > scene.clientHeight + 2,
      );

      if (hasOverflow || viewport.clientHeight < CONFIG.minimumViewportHeight) {
        delete viewport.dataset.animated;

        return createMobileAnimation(mobile);
      }

      /*
       * Scene elements
       */

      const reveal = select('[data-experience-scene="reveal"]');

      const highlights = select('[data-experience-scene="highlights"]');

      const composition = select('[data-experience-scene="composition"]');

      const collection = select('[data-experience-scene="collection"]');

      const backgroundText = select("[data-experience-background-text]");

      const rings = select("[data-experience-ring]");

      const glow = select("[data-experience-glow]");

      const highlightItems = select("[data-experience-highlight]");

      const minerals = select("[data-experience-mineral]");

      const scrollIndicator = select("[data-experience-scroll-indicator]");

      const progressBar = select("[data-experience-progress-bar]");

      /*
       * Responsive geometry
       */

      const x = (ratio: number) => viewport.clientWidth * ratio;

      const y = (ratio: number) => viewport.clientHeight * ratio;

      const getCenteredIndex = (index: number) =>
        index - (productCount - 1) / 2;

      function getCollectionSpacing() {
        return Math.min(x(0.19), x(0.66) / Math.max(1, productCount - 1));
      }

      function getCollectionX(index: number) {
        return getCenteredIndex(index) * getCollectionSpacing();
      }

      function getCollectionScale(index: number) {
        const baseScale =
          productCount <= 2 ? 0.92 : productCount <= 4 ? 0.78 : 0.62;

        return baseScale - Math.abs(getCenteredIndex(index)) * 0.025;
      }

      function getCollectionRotation(index: number) {
        return gsap.utils.clamp(-5, 5, getCenteredIndex(index) * 5);
      }

      /*
       * Timeline positions
       */

      const discoveryStart = CONFIG.revealDuration;

      const compositionStart =
        discoveryStart + productCount * CONFIG.productDuration;

      const collectionStart = compositionStart + CONFIG.compositionDuration;

      const timelineDuration = collectionStart + CONFIG.collectionDuration;

      /*
       * Initial states
       */

      gsap.set(viewport, {
        backgroundColor,
      });

      gsap.set(reveal, {
        autoAlpha: 1,
        y: 0,
      });

      gsap.set(highlights, {
        autoAlpha: 0,
        y: 22,
      });

      gsap.set(composition, {
        autoAlpha: 0,
        y: 20,
      });

      gsap.set(collection, {
        autoAlpha: 0,
        y: 20,
      });

      gsap.set(productDetails, {
        autoAlpha: 0,
        y: 18,
      });

      gsap.set(highlightItems, {
        autoAlpha: 0,
        x: -15,
      });

      if (minerals.length > 0) {
        gsap.set(minerals, {
          autoAlpha: 0,
          scale: 0.9,
          y: 12,
        });
      }

      gsap.set(bottles, {
        autoAlpha: 1,

        x: (index: number) => getCollectionX(index) * 0.85,

        y: () => y(0.075),

        scale: (index: number) => getCollectionScale(index) * 0.9,

        rotation: (index: number) => getCollectionRotation(index),

        transformOrigin: "50% 50%",
      });

      gsap.set(backgroundText, {
        x: 0,
        scale: 1,
        opacity: 1,
      });

      gsap.set(rings, {
        x: 0,
        scale: 1,
      });

      gsap.set(glow, {
        scale: 1,
      });

      gsap.set(scrollIndicator, {
        autoAlpha: 1,
        y: 0,
      });

      gsap.set(progressBar, {
        scaleX: 0,
        transformOrigin: "left center",
      });

      /*
       * Master timeline
       */

      const timeline = gsap.timeline({
        defaults: {
          ease: "power2.inOut",
        },

        scrollTrigger: {
          trigger: viewport,

          start: "top top",

          end: () => `+=${viewport.clientHeight * timelineDuration * 0.44}`,

          pin: true,
          pinSpacing: true,

          scrub: CONFIG.scrub,

          anticipatePin: 0,
          invalidateOnRefresh: true,
        },
      });

      /*
       * Scene 01 — Introduction
       */

      timeline.addLabel("reveal", 0);

      timeline.set(
        bottles,
        {
          x: (index: number) => getCollectionX(index) * 0.85,

          y: () => y(0.075),

          scale: (index: number) => getCollectionScale(index) * 0.9,
        },
        "reveal",
      );

      timeline.to(
        bottles,
        {
          x: (index: number) => getCollectionX(index),

          y: () => y(0.06),

          scale: (index: number) => getCollectionScale(index),

          rotation: (index: number) => getCollectionRotation(index),

          duration: 1.35,
        },
        "reveal",
      );

      timeline.to(
        backgroundText,
        {
          scale: 1.06,
          duration: 1.5,
        },
        "reveal",
      );

      timeline.to(
        glow,
        {
          scale: 1.08,
          duration: 1.5,
        },
        "reveal",
      );

      timeline.to(
        scrollIndicator,
        {
          autoAlpha: 0,
          y: 8,
          duration: 0.6,
        },
        "reveal+=0.65",
      );

      /*
       * Scene 02 — Product discovery
       */

      timeline.addLabel("discovery", discoveryStart);

      timeline.to(
        reveal,
        {
          autoAlpha: 0,
          y: -18,
          duration: 0.7,
        },
        "discovery",
      );

      timeline.to(
        backgroundText,
        {
          x: () => x(-0.07),
          opacity: 0.3,
          duration: 1.35,
        },
        "discovery",
      );

      timeline.to(
        rings,
        {
          x: () => x(0.2),
          scale: 1.12,
          duration: 1.35,
        },
        "discovery",
      );

      timeline.to(
        highlights,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
        },
        "discovery+=0.4",
      );

      /*
       * Dynamic product chapters
       */

      bottles.forEach((bottle, activeIndex) => {
        const label = `product-${activeIndex}`;

        const start = discoveryStart + activeIndex * CONFIG.productDuration;

        timeline.addLabel(label, start);

        if (activeIndex > 0) {
          timeline.to(
            productDetails[activeIndex - 1],
            {
              autoAlpha: 0,
              y: -18,
              duration: 0.5,
            },
            label,
          );
        }

        bottles.forEach((item, index) => {
          const isActive = index === activeIndex;

          const isNeighbor =
            index === activeIndex + 1 ||
            (activeIndex === productCount - 1 && index === activeIndex - 1);

          const direction = index < activeIndex ? -1 : 1;

          timeline.to(
            item,
            {
              x: () => (isActive ? x(0.17) : x(0.29)),

              y: () => (isActive ? 0 : y(-0.025)),

              scale: isActive ? 1.06 : isNeighbor ? 0.72 : 0.6,

              rotation: isActive ? 0 : direction * 4,

              autoAlpha: isActive ? 1 : isNeighbor ? 0.35 : 0,

              duration: CONFIG.transitionDuration,
            },
            label,
          );
        });

        const activeDetail = productDetails[activeIndex];

        const activeHighlights = gsap.utils.toArray<HTMLElement>(
          "[data-experience-highlight]",
          activeDetail,
        );

        timeline.to(
          activeDetail,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
          },
          `${label}+=0.55`,
        );

        if (activeHighlights.length > 0) {
          timeline.to(
            activeHighlights,
            {
              autoAlpha: 1,
              x: 0,

              stagger: {
                amount: 0.35,
              },

              duration: 0.65,
            },
            `${label}+=0.85`,
          );
        }

        timeline.to(
          bottle,
          {
            scale: 1.065,
            duration: 0.8,
          },
          `${label}+=1.5`,
        );
      });

      /*
       * Scene 03 — Mineral composition
       */

      timeline.addLabel("composition", compositionStart);

      timeline.to(
        highlights,
        {
          autoAlpha: 0,
          y: -18,
          duration: 0.65,
        },
        "composition",
      );

      timeline.to(
        bottles,
        {
          x: (index: number) => getCollectionX(index) * 0.65,

          y: 0,

          scale: (index: number) => getCollectionScale(index) * 0.9,

          rotation: 0,
          autoAlpha: 1,
          duration: 1.4,
        },
        "composition",
      );

      timeline.to(
        viewport,
        {
          backgroundColor: secondaryBackgroundColor,

          duration: 1.5,
        },
        "composition",
      );

      timeline.to(
        backgroundText,
        {
          x: 0,
          opacity: 0.4,
          scale: 1.02,
          duration: 1.4,
        },
        "composition",
      );

      timeline.to(
        rings,
        {
          x: 0,
          scale: 1.05,
          duration: 1.4,
        },
        "composition",
      );

      timeline.to(
        glow,
        {
          scale: 1.15,
          duration: 1.5,
        },
        "composition",
      );

      timeline.to(
        composition,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
        },
        "composition+=0.55",
      );

      if (minerals.length > 0) {
        timeline.to(
          minerals,
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,

            stagger: {
              amount: 0.4,
            },

            duration: 0.75,
          },
          "composition+=0.8",
        );
      }

      /*
       * Scene 04 — Complete collection
       */

      timeline.addLabel("collection", collectionStart);

      timeline.to(
        composition,
        {
          autoAlpha: 0,
          y: -18,
          duration: 0.65,
        },
        "collection",
      );

      timeline.to(
        bottles,
        {
          x: (index: number) => getCollectionX(index),

          y: () => y(-0.15),

          scale: (index: number) => getCollectionScale(index),

          rotation: (index: number) => getCollectionRotation(index),

          autoAlpha: 1,
          duration: 1.5,
        },
        "collection",
      );

      timeline.to(
        viewport,
        {
          backgroundColor,
          duration: 1.5,
        },
        "collection",
      );

      timeline.to(
        backgroundText,
        {
          x: 0,
          scale: 1,
          opacity: 0.8,
          duration: 1.5,
        },
        "collection",
      );

      timeline.to(
        rings,
        {
          x: 0,
          scale: 1.2,
          duration: 1.5,
        },
        "collection",
      );

      timeline.to(
        glow,
        {
          scale: 1.08,
          duration: 1.5,
        },
        "collection",
      );

      timeline.to(
        collection,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
        },
        "collection+=0.8",
      );

      /*
       * Scroll progress
       */

      timeline.to(
        progressBar,
        {
          scaleX: 1,
          duration: timelineDuration,
          ease: "none",
        },
        0,
      );

      ScrollTrigger.refresh();

      return () => {
        delete viewport.dataset.animated;
      };
    },
  );

  return () => {
    media.revert();
  };
}
