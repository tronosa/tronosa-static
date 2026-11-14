import { z } from "zod";

import { sectionSchema } from "./section.schema";
import { seoSchema } from "./seo.schema";

export const pageSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  slug: z.string(),

  modifiedAt: z.iso.datetime({ offset: true }).optional(),

  seo: seoSchema,

  content: z.object({
    sections: z.array(sectionSchema),
  }),
});

export type Page = z.infer<typeof pageSchema>;
