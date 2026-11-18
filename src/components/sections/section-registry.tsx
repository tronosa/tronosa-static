import type { ReactNode } from "react";

import type { Section, SectionType } from "@/content/schemas/section.schema";
import { VideoHero } from "./VideoHero";
import { ImageHero } from "./ImageHero";
import { CardSlider } from "./CardSlider";
import { FeatureMosaic } from "./FeatureMosaic";
import { StatsBanner } from "./StatsBanner";
import { PartnersMarquee } from "./PartnersMarquee";
import { Faq } from "./Faq";
import { DistributionMap } from "./DistributionMap";
import { ProductShowcase } from "./ProductShowcase";
import { ProductExperience } from "./ProductExperience";

type SectionByType<T extends SectionType> = Extract<Section, { type: T }>;

type SectionRegistry = {
  [T in SectionType]: (section: SectionByType<T>) => ReactNode;
};

export const sectionRegistry = {
  "video-hero": ({ content }) => <VideoHero {...content} />,
  "image-hero": ({ content }) => <ImageHero {...content} />,
  "card-slider": ({ content }) => <CardSlider {...content} />,
  "feature-mosaic": ({ content }) => <FeatureMosaic {...content} />,
  "stats-banner": ({ content }) => <StatsBanner {...content} />,
  "partners-marquee": ({ content }) => <PartnersMarquee {...content} />,
  faq: ({ content }) => <Faq {...content} />,
  "distribution-map": ({ content }) => <DistributionMap {...content} />,
  "product-showcase": ({ content }) => <ProductShowcase {...content} />,
  "product-experience": ({ content }) => <ProductExperience {...content} />,
} satisfies SectionRegistry;
