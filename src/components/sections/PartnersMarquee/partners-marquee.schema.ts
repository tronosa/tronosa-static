import { z } from "zod";
import { pictureSourceSchema } from "@/components/media/Picture/picture.schema";
export const partnersMarqueeContentSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).optional(),
  partners: z
    .array(
      z.object({ name: z.string().trim().min(1), logo: pictureSourceSchema }),
    )
    .min(1),
  accessibility: z.object({ pauseLabel: z.string().trim().min(1) }),
});

export const partnersMarqueeSectionSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("partners-marquee"),
  content: partnersMarqueeContentSchema,
});
