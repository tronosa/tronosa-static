import { z } from "zod";

import { videoHeroSectionSchema } from "@/components/sections/VideoHero/video-hero.schema";
import { imageHeroSectionSchema } from "@/components/sections/ImageHero/image-hero.schema";
import { cardSliderSectionSchema } from "@/components/sections/CardSlider/card-slider.schema";
import { featureMosaicSectionSchema } from "@/components/sections/FeatureMosaic/feature-mosaic.schema";
import { statsBannerSectionSchema } from "@/components/sections/StatsBanner/stats-banner.schema";
import { partnersMarqueeSectionSchema } from "@/components/sections/PartnersMarquee/partners-marquee.schema";
import { faqSectionSchema } from "@/components/sections/Faq/faq.schema";
import { distributionMapSectionSchema } from "@/components/sections/DistributionMap/distribution-map.schema";

export const sectionSchema = z.discriminatedUnion("type", [
  videoHeroSectionSchema,
  imageHeroSectionSchema,
  cardSliderSectionSchema,
  featureMosaicSectionSchema,
  statsBannerSectionSchema,
  partnersMarqueeSectionSchema,
  faqSectionSchema,
  distributionMapSectionSchema,
]);

export type Section = z.infer<typeof sectionSchema>;
export type SectionType = Section["type"];
