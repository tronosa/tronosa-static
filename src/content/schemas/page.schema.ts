import { z } from "zod";

import { sectionSchema } from "./section.schema";
import { seoSchema } from "./seo.schema";

export const pageSchema = z.object({
  id: z.string().min(1),
  slug: z.string(),
  seo: seoSchema,
  content: z.object({
    sections: z.array(sectionSchema),
  }),
});

export type Page = z.infer<typeof pageSchema>;
