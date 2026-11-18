import type { z } from "zod";
import type {
  featureMosaicContentSchema,
  featureMosaicSectionSchema,
} from "./feature-mosaic.schema";

export type FeatureMosaicContent = z.infer<typeof featureMosaicContentSchema>;
export type FeatureMosaicSection = z.infer<typeof featureMosaicSectionSchema>;
export type FeatureMosaicProps = FeatureMosaicContent & { className?: string };
