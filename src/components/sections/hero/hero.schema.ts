import { z } from "zod";

export const heroSchema = z.object({
  id: z.string().min(1),
  type: z.literal("hero"),
  content: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    image: z
      .object({
        src: z.string().min(1),
        alt: z.string().min(1),
      })
      .optional(),
  }),
});

export type HeroSectionData = z.infer<typeof heroSchema>;
export type HeroProps = HeroSectionData["content"];
