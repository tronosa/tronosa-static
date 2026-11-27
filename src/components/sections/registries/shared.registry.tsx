import "server-only";

import type { SharedSection } from "@/content/schemas/section.schema";

import type { SectionRegistry } from "./types";

export const sharedSectionRegistry = {
  "product-introduction": async (section) => {
    const { ProductIntroduction } = await import("../ProductIntroduction");

    return <ProductIntroduction {...section.content} />;
  },
  "product-catalog": async (section) => {
    const { ProductCatalog } = await import("../ProductCatalog");

    return <ProductCatalog {...section.content} />;
  },
  "video-hero": async (section) => {
    const { VideoHero } = await import("../VideoHero");

    return <VideoHero {...section.content} />;
  },
  "text-hero": async (section) => {
    const { TextHero } = await import("../TextHero");

    return <TextHero {...section.content} />;
  },

  "image-hero": async (section) => {
    const { ImageHero } = await import("../ImageHero");

    return <ImageHero {...section.content} />;
  },
  "card-slider": async (section) => {
    const { CardSlider } = await import("../CardSlider");

    return <CardSlider {...section.content} />;
  },
  "feature-mosaic": async (section) => {
    const { FeatureMosaic } = await import("../FeatureMosaic");

    return <FeatureMosaic {...section.content} />;
  },
  "stats-banner": async (section) => {
    const { StatsBanner } = await import("../StatsBanner");

    return <StatsBanner {...section.content} />;
  },
  "partners-marquee": async (section) => {
    const { PartnersMarquee } = await import("../PartnersMarquee");

    return <PartnersMarquee {...section.content} />;
  },
  faq: async (section) => {
    const { Faq } = await import("../Faq");

    return <Faq {...section.content} />;
  },
  "distribution-map": async (section) => {
    const { DistributionMap } = await import("../DistributionMap");

    return <DistributionMap {...section.content} />;
  },
  "product-showcase": async (section) => {
    const { ProductShowcase } = await import("../ProductShowcase");

    return <ProductShowcase {...section.content} />;
  },
  "product-experience": async (section) => {
    const { ProductExperience } = await import("../ProductExperience");

    return <ProductExperience {...section.content} />;
  },
  "content-section": async (section) => {
    const { ContentSection } = await import("../ContentSection");

    return <ContentSection {...section.content} />;
  },
  "contact-form": async (section) => {
    const { ContactForm } = await import("../ContactForm");

    return <ContactForm {...section.content} />;
  },
  "editorial-media": async (section) => {
    const { EditorialMedia } = await import("../EditorialMedia");

    return <EditorialMedia {...section.content} />;
  },
  "editorial-composition": async (section) => {
    const { EditorialComposition } = await import("../EditorialComposition");

    return <EditorialComposition {...section.content} />;
  },
  "heritage-story": async (section) => {
    const { HeritageStory } = await import("../HeritageStory");

    return <HeritageStory {...section.content} />;
  },
  "people-gallery": async (section) => {
    const { PeopleGallery } = await import("../PeopleGallery");

    return <PeopleGallery {...section.content} />;
  },
  "editorial-closing": async (section) => {
    const { EditorialClosing } = await import("../EditorialClosing");

    return <EditorialClosing {...section.content} />;
  },
} satisfies SectionRegistry<SharedSection>;
