import "server-only";

import type { ReactNode } from "react";

import type { Section, SectionType } from "@/content/schemas/section.schema";

type SectionByType<T extends SectionType> = Extract<Section, { type: T }>;

type SectionRegistry = {
  [T in SectionType]: (section: SectionByType<T>) => Promise<ReactNode>;
};

export const sectionRegistry = {
  "video-hero": async ({ content }) => {
    const { VideoHero } = await import("./VideoHero");

    return <VideoHero {...content} />;
  },

  "image-hero": async ({ content }) => {
    const { ImageHero } = await import("./ImageHero");

    return <ImageHero {...content} />;
  },

  "card-slider": async ({ content }) => {
    const { CardSlider } = await import("./CardSlider");

    return <CardSlider {...content} />;
  },

  "feature-mosaic": async ({ content }) => {
    const { FeatureMosaic } = await import("./FeatureMosaic");

    return <FeatureMosaic {...content} />;
  },

  "stats-banner": async ({ content }) => {
    const { StatsBanner } = await import("./StatsBanner");

    return <StatsBanner {...content} />;
  },

  "partners-marquee": async ({ content }) => {
    const { PartnersMarquee } = await import("./PartnersMarquee");

    return <PartnersMarquee {...content} />;
  },

  faq: async ({ content }) => {
    const { Faq } = await import("./Faq");

    return <Faq {...content} />;
  },

  "distribution-map": async ({ content }) => {
    const { DistributionMap } = await import("./DistributionMap");

    return <DistributionMap {...content} />;
  },

  "product-showcase": async ({ content }) => {
    const { ProductShowcase } = await import("./ProductShowcase");

    return <ProductShowcase {...content} />;
  },

  "product-experience": async ({ content }) => {
    const { ProductExperience } = await import("./ProductExperience");

    return <ProductExperience {...content} />;
  },
} satisfies SectionRegistry;
