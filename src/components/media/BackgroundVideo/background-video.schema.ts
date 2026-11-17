import { z } from "zod";

export const backgroundVideoSchema = z.object({
  src: z.string().trim().min(1),
  poster: z.string().trim().min(1),
  type: z.enum(["video/mp4", "video/webm"]).default("video/mp4"),
});

export const backgroundVideoAccessibilitySchema = z.object({
  playLabel: z.string().trim().min(1),
  pauseLabel: z.string().trim().min(1),
});
