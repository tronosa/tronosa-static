import { z } from "@/lib/validation/zod";

export const backgroundVideoSourceSchema = z.object({
  src: z.string().trim().min(1),
  type: z.enum(["video/mp4", "video/webm"]).default("video/mp4"),
});

export const backgroundVideoSchema = backgroundVideoSourceSchema.extend({
  poster: z.string().trim().min(1),
  tablet: backgroundVideoSourceSchema.optional(),
  mobile: backgroundVideoSourceSchema.optional(),
});

export const backgroundVideoAccessibilitySchema = z.object({
  playLabel: z.string().trim().min(1),
  pauseLabel: z.string().trim().min(1),
});
