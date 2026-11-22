import { z } from "@/lib/validation/zod";

const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const seoSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),

  canonical: z.string().nullable().optional(),

  index: z.boolean().default(true),
  follow: z.boolean().default(true),

  openGraph: z
    .object({
      title: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      image: imageSchema.optional(),
    })
    .optional(),

  twitter: z
    .object({
      card: z
        .enum(["summary", "summary_large_image"])
        .default("summary_large_image"),
    })
    .optional(),
});

export type Seo = z.infer<typeof seoSchema>;
export type SeoImage = z.infer<typeof imageSchema>;
