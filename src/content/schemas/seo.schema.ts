import { z } from "zod";

export const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  index: z.boolean().default(true),
  follow: z.boolean().default(true),
  image: z.string().optional(),
});

export type Seo = z.infer<typeof seoSchema>;
