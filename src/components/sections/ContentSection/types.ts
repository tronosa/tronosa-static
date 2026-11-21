import type { z } from "zod";

import type {
  contentSectionContentSchema,
  contentSectionWidthSchema,
} from "./content-section.schema";

export type ContentSectionWidth = z.infer<typeof contentSectionWidthSchema>;

export type ContentSectionProps = z.infer<typeof contentSectionContentSchema>;
