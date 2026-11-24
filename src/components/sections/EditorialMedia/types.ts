import type { z } from "zod";

import type {
  editorialMediaContentSchema,
  editorialMediaSectionSchema,
} from "./editorial-media.schema";

export type EditorialMediaContent = z.infer<typeof editorialMediaContentSchema>;

export type EditorialMediaSection = z.infer<typeof editorialMediaSectionSchema>;

export type EditorialMediaProps = EditorialMediaContent & {
  className?: string;
};
