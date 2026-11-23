import { z } from "@/lib/validation/zod";
import { pictureSchema } from "@/components/media/Picture/picture.schema";

const cardFields = {
  title: z.string().trim().min(1),
  headline: z.string().trim().min(1),
  description: z.string().trim().min(1).optional(),
};

export const sliderCardSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("text"), ...cardFields }),
  z.object({ kind: z.literal("image"), ...cardFields, image: pictureSchema }),
]);
export const cardSliderContentSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).optional(),
  cards: z.array(sliderCardSchema).min(1),
  accessibility: z.object({
    previousLabel: z.string().trim().min(1),
    nextLabel: z.string().trim().min(1),
    viewportLabel: z.string().trim().min(1),
  }),
});

export const cardSliderSectionSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("card-slider"),
  content: cardSliderContentSchema,
});
