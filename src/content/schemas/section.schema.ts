import { z } from "@/lib/validation/zod";

import { videoHeroSectionSchema } from "@/components/sections/VideoHero/video-hero.schema";
import { imageHeroSectionSchema } from "@/components/sections/ImageHero/image-hero.schema";
import { cardSliderSectionSchema } from "@/components/sections/CardSlider/card-slider.schema";
import { featureMosaicSectionSchema } from "@/components/sections/FeatureMosaic/feature-mosaic.schema";
import { statsBannerSectionSchema } from "@/components/sections/StatsBanner/stats-banner.schema";
import { partnersMarqueeSectionSchema } from "@/components/sections/PartnersMarquee/partners-marquee.schema";
import { faqSectionSchema } from "@/components/sections/Faq/faq.schema";
import { distributionMapSectionSchema } from "@/components/sections/DistributionMap/distribution-map.schema";
import { productShowcaseSectionSchema } from "@/components/sections/ProductShowcase/product-showcase.schema";
import { productExperienceSectionSchema } from "@/components/sections/ProductExperience/product-experience.schema";
import { contentSectionSchema } from "@/components/sections/ContentSection/content-section.schema";
import { contactFormSectionSchema } from "@/components/sections/ContactForm/contact-form.schema";
import { editorialMediaSectionSchema } from "@/components/sections/EditorialMedia/editorial-media.schema";

import { blogSpecificSectionSchemas } from "./blog-section.schema";
import { articleSpecificSectionSchemas } from "./article-section.schema";

export const sharedSectionSchemas = [
  videoHeroSectionSchema,
  imageHeroSectionSchema,
  cardSliderSectionSchema,
  featureMosaicSectionSchema,
  statsBannerSectionSchema,
  partnersMarqueeSectionSchema,
  faqSectionSchema,
  distributionMapSectionSchema,
  productShowcaseSectionSchema,
  productExperienceSectionSchema,
  contentSectionSchema,
  contactFormSectionSchema,
  editorialMediaSectionSchema,
] as const;

export const sharedSectionSchema = z.discriminatedUnion(
  "type",
  sharedSectionSchemas,
);

export const standardPageSectionSchema = sharedSectionSchema;

export const blogSectionSchema = z.discriminatedUnion("type", [
  ...sharedSectionSchemas,
  ...blogSpecificSectionSchemas,
]);

export const articleSectionSchema = z.discriminatedUnion("type", [
  ...sharedSectionSchemas,
  ...articleSpecificSectionSchemas,
]);

export const sectionSchema = z.discriminatedUnion("type", [
  ...sharedSectionSchemas,
  ...blogSpecificSectionSchemas,
  ...articleSpecificSectionSchemas,
]);

export const allSectionSchema = sectionSchema;

export type SharedSection = z.infer<typeof sharedSectionSchema>;

export type StandardPageSection = z.infer<typeof standardPageSectionSchema>;

export type BlogSection = z.infer<typeof blogSectionSchema>;

export type ArticleSection = z.infer<typeof articleSectionSchema>;

export type Section = z.infer<typeof sectionSchema>;

export type SectionType = Section["type"];

export type AllSection = Section;

export type AllSectionType = SectionType;
