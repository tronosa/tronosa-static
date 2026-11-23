import { z } from "@/lib/validation/zod";
import { pictureSchema } from "@/components/media/Picture/picture.schema";
export const featureMosaicContentSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  image: pictureSchema,
  imagePosition: z.enum(["left", "right"]).default("left"),
  cards: z
    .array(
      z.object({
        title: z.string().trim().min(1),
        description: z.string().trim().min(1),
      }),
    )
    .length(4),
});

export const featureMosaicSectionSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("feature-mosaic"),
  content: featureMosaicContentSchema,
});
