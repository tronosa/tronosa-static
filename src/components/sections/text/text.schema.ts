import { z } from "zod";

export const textSchema = z.object({
  id: z.string().min(1),
  type: z.literal("text"),
  content: z.object({
    heading: z.string().optional(),
    paragraphs: z.array(z.string().min(1)).min(1),
  }),
});

export type TextSectionData = z.infer<typeof textSchema>;
export type TextProps = TextSectionData["content"];
