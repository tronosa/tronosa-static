import { z } from "zod";

export const pictureSourceSchema = z.object({
  src: z.string().trim().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const pictureSchema = z.object({
  alt: z.string(),
  desktop: pictureSourceSchema,
  tablet: pictureSourceSchema.optional(),
  mobile: pictureSourceSchema.optional(),
});
