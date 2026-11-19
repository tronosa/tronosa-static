import { z } from "zod";

export const pictureQualitySchema = z.union([
  z.literal(60),
  z.literal(65),
  z.literal(70),
  z.literal(75),
  z.literal(80),
]);

export const pictureSourceSchema = z.object({
  src: z.string().trim().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  quality: pictureQualitySchema.optional(),
});

export const pictureSchema = z.object({
  alt: z.string(),
  desktop: pictureSourceSchema,
  tablet: pictureSourceSchema.optional(),
  mobile: pictureSourceSchema.optional(),
});
